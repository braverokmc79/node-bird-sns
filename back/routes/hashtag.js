const express = require('express');
const { Op } = require('sequelize');
const { Post, Hashtag, Image, User, Comment } = require('../models');

const router = express.Router();



//GET /hashtag  /노드
router.get('/:hashtag', async (req, res, next) => {
    console.log(" /hashtag  /노드  :  ", decodeURIComponent(req.params.hashtag));
    let hashtag = decodeURIComponent(req.params.hashtag);

    //다음과 같은 형식으로 파라미터를 받을 경우
    // /_next/data/development리액트.json?tag=리액트
    if (hashtag.indexOf("tag=") !== -1) {
        hashtag = hashtag.split("tag=");
        hashtag = hashtag[1];
        console.log("문자열 포함  :hashtag  => ", hashtag);
    }

    try {
        const where = {};
        if (parseInt(req.query.lastId, 10)) { //초기 로딩이 아닐때
            //다음 코드 내용은 id 가  lastId  보다 작은 것 =>  id < lastId
            // Op 의미는 연산자 의미  lt 는  <  
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }
        };

        const posts = await Post.findAll({
            where,
            limit: 10,
            order: [['createdAt', 'DESC'],],
            include: [
                {
                    model: Hashtag,
                    where: { name: hashtag },
                },
                {
                    model: User,
                    attributes: ['id', 'nickname'],
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