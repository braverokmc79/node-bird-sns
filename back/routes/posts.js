const express = require('express');
const { Op } = require('sequelize');
const { Post, Image, User, Comment } = require('../models');

const router = express.Router();



//GET /posts
router.get('/', async (req, res, next) => {

    try {
        console.log(" 마지막 아이디  :", req.query.lastId);
        const where = {};
        if (parseInt(req.query.lastId, 10)) { //초기 로딩이 아닐때
            //다음 코드 내용은 id 가  lastId  보다 작은 것 =>  id < lastId
            // Op 의미는 연산자 의미  lt 는  <  
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }
        };

        const posts = await Post.findAll({
            where,
            limit: 10,
            order: [
                ['createdAt', 'DESC'],
                [Comment, 'createdAt', 'DESC']
            ],
            // offsset: parseInt(req.params.limit),
            //21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1
            include: [{
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
                model: User, //좋아요 누른 사람       
                as: 'Likers',
                attributes: ['id']
            },
            {
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
            }
            ]
        });

        res.status(200).json(posts);

    } catch (error) {
        console.error("posts error : ", error);
        next(error);
    }

});



module.exports = router;