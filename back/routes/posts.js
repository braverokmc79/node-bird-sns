const express = require('express');
const { Post, Image, User, Comment } = require('../models');

const router = express.Router();



//GET /posts
router.get('/:limit', async (req, res, next) => {

    try {
        console.log("req.params : ", req.params.limit);
        const posts = await Post.findAll({
            // where: { id: lastId },
            limit: 10,
            order: [
                ['createdAt', 'DESC'],
                [Comment, 'createdAt', 'DESC']
            ],
            offsset: parseInt(req.params.limit),
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