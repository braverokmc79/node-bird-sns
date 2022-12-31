const { json } = require('body-parser');
const express = require('express');
const { Post, User, Image, Comment, Hashtag } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();


try {
    //업로드 폴더가 존재하는 지 확인 없으면 에러
    fs.accessSync('uploads');
} catch (error) {
    console.log("업로드 폴더가 없으므로 생성합니다.");
    fs.mkdirSync('uploads');
}


//multer 은 개별적으로 함수로  미들웨어 처리
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) { //제로초.png
            //path는 노드에서 기본적으로 제공
            const ext = path.extname(file.originalname); //확장자 추출(.png)
            const basename = path.basename(file.originalname, ext);//제로초라는 이름만 추출 된다.
            done(null, basename + '_' + new Date().getTime() + ext); //제로초3213421312.png
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 } //20MB
});

//이미지 업로드  // 하나만 올릴경우 => upload.single('image') , text나 json : upload.none()
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {  //POST  /post/images
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));

});



//** passport 특성상 로그인 하면, 라우터 접근시 항상 deserializeUser 실행해서 req.user 를 만든다.  req.user.id로 접근해서 정보를 가져올 수 있다.
//POST  /post
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id
        });
        if (hashtags) {
            //findOneCreate => 있으면 가져오고 없으면 등록처리한다.
            const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate(
                {
                    where: { name: tag.slice(1).toLowerCase() }
                }
            )));
            //result 값 예  => +[[노드, true] , [리액트, true]]
            await post.addHashtag(result.map((v) => v[0]));
        }


        if (req.body.image) {
            //1.업로드 이미지가 여러개인경우 => image : [제로초.png, 부기초.png]
            if (Array.isArray(req.body.image)) {
                //await Promise.all ~ map ~  Image.creat  처리하면 이미지들의 URL 배열 데이터들이 DB 에 저장 된다.
                const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
                //Image 테이블의 PostId 컬럼값이 업데이트 처리된다.
                await post.addImages(images);
            } else {
                //2. 업로드 이미지가 하나인 경우 =>  image : 제로초.png
                const image = await Image.create({ src: req.body.image });
                await post.addImages(image);
            }
        }

        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
                model: Image,
            },
            {
                model: Comment,
                include: [{
                    model: User, //댓글 작성자
                    attributes: ['id', 'nickname']
                }]
            }, {
                model: User,  //게시글 작성자
                attributes: ['id', 'nickname']

            }, {
                model: User, //좋아요 누른 사람       
                as: 'Likers',
                attributes: ['id']
            }
            ]
        })

        res.status(201).json(fullPost);
    } catch (error) {
        console.error(" Post 에러 :  ", error);
        next(error);
    }
});






//POST 댓글  /post
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {     //POST /post/1/comment
    try {

        const post = await Post.findOne({
            where: { id: req.params.postId }
        });

        if (!post) {
            return res.status(403).send("존재하지 않는 게시글입니다.");
        }

        const comment = await Comment.create({
            content: req.body.content,
            PostId: req.params.postId,
            UserId: req.user.id
        });

        const fullComment = await Comment.findOne({
            where: { id: comment.id },
            include: [{
                model: User,
                attributes: ['id', 'nickname']
            }]
        })

        //console.log(" 댓글 작성 완료 : ", comment);

        res.status(201).json(fullComment);
    } catch (error) {
        console.error(" comment 에러 :  ", error);
        next(error);
    }
});



router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {  //PATcH  /post/1/like
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId }
        });

        if (!post) {
            return res.status(403).send("게시글이 존재하지 않습니다.");
        }

        await post.addLikers(req.user.id);
        res.json({ PostId: post.id, UserId: req.user.id })
    } catch (error) {
        console.error(error);
        next(error);
    }

});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {  //DELETE  /post/1/like
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId }
        });

        if (!post) {
            return res.status(403).send("게시글이 존재하지 않습니다.");
        }

        await post.removeLikers(req.user.id);
        res.json({ PostId: post.id, UserId: req.user.id })
    } catch (error) {
        console.error(error);
        next(error);
    }

})




//게시글 삭제 DELETE  /post/10
router.delete('/:postId', isLoggedIn, async (req, res, next) => {

    try {
        await Post.destroy({
            where: {
                id: req.params.postId,
                UserId: req.user.id
            },
        });
        res.status(200).json({ PostId: parseInt(req.params.postId, 10) })
    } catch (error) {
        console.error(error);
        next(error);
    }
});









//POST 리트윗  /post
router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {     //POST /post/1/retweet
    try {

        const post = await Post.findOne({
            where: { id: req.params.postId },
            include: {
                model: Post,
                as: 'Retweet'
            }
        });

        if (!post) {
            return res.status(403).send("존재하지 않는 게시글입니다.");
        }
        //자기 게시글은 리트윗 할수 없다.   또는 다른사람이 리트윗한 게시물의 작성자 아이디가 , 자기 게시물이라면 리트윗금지
        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            return res.status(403).send("자신의 글은 리트윗 할수 없습니다.");
        }

        // 리트윗한 아이디가 존재하면 해당 리트윗 아이디를 사용하고, 없으면 게시글 아이디를 리트윗아이디로 한다.
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId
            }
        });

        if (exPost) {
            return res.status(403).send("이미 리트윗했습니다.");
        }

        const retweet = await Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content: 'retweet'
        });

        const retweetWithPrevPost = await Post.findOne({
            where: { id: retweet.id },
            include: [{
                model: Post,
                as: 'Retweet',
                include: [
                    {
                        model: User,
                        attributes: ['id', 'nickname']
                    },
                    {
                        model: Image
                    }
                ]
            },
            {
                model: User,
                attributes: ['id', 'nickname']
            },
            {
                model: Image
            },
            {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname']
                }]
            },
            {
                model: User,
                as: 'Likers',
                attributes: ['id']
            }
            ]
        })



        res.status(201).json(retweetWithPrevPost);
    } catch (error) {
        console.error(" comment 에러 :  ", error);
        next(error);
    }
});



module.exports = router;