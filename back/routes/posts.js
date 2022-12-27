const express = require('express');
const { Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();



//** passport 특성상 로그인 하면, 라우터 접근시 항상 deserializeUser 실행해서 req.user 를 만든다.  req.user.id로 접근해서 정보를 가져올 수 있다.
//POST  /post
router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id
        });
        res.status(201).json(post);
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

        const comment = await Post.create({
            content: req.body.content,
            PostId: req.params.postId,
            UserId: req.user.id
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error(" comment 에러 :  ", error);
        next(error);
    }
});




//DELETE  /post
router.delete('/', (req, res) => {
    res.json({ id: 1 })
});



module.exports = router;