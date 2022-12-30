const { json } = require('body-parser');
const express = require('express');
const { Post, User, Image, Comment } = require('../models');
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
            done(null, basename + new Date().getTime() + ext); //제로초3213421312.png
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
router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id
        });

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




module.exports = router;