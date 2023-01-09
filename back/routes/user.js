const express = require('express');
const { User, Post, Comment, Image } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');


//브라우저에서 새로고침 할때마다 요청처리 된다.
router.get('/', async (req, res, next) => {
    console.log("브라우저에서 새로고침 할때마다 요청처리 :", req.headers);

    try {
        if (req.user) {
            const fullUserWithoutPassword = await User.findOne({
                where: {
                    id: req.user.id
                },
                attributes: {
                    exclude: ['password']
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                }, {
                    model: User,
                    as: "Followers",
                    attributes: ['id'],
                },
                {
                    model: User,
                    as: "Followings",
                    attributes: ['id'],
                }
                ]
            })
            res.status(200).json(fullUserWithoutPassword);
        } else {
            res.status(200).json(null);
        }

    } catch (error) {
        console.error("/ 쿠키 정보 가져오기 에러 :  ", error);
        next(error);
    }
});




//특정 유저 정보 하나 가져오기
router.get('/:userId', async (req, res, next) => {
    console.log(" 유저 정보 가져오기 : ", req.params.userId);
    try {
        const fullUserWithoutPassword = await User.findOne({
            where: {
                id: req.params.userId
            },
            attributes: {
                exclude: ['password']
            },
            include: [{
                model: Post,
                attributes: ['id'],
            }, {
                model: User,
                as: "Followers",
                attributes: ['id'],
            },
            {
                model: User,
                as: "Followings",
                attributes: ['id'],
            }
            ]
        })

        if (fullUserWithoutPassword) {
            const data = fullUserWithoutPassword.toJSON();

            //개인정보 침해 예방을 위해 서버에서  데이터길이만 변경해서 보내 준다.
            data.Posts = data.Posts.length;
            data.Followings = data.Followings.length;
            data.Followers = data.Followers.length;

            res.status(200).json(data);
        } else {
            res.status(404).json("존재하지 않는 사용자입니다.");
        }
    } catch (error) {
        console.error("/ 쿠키 정보 가져오기 에러 :  ", error);
        next(error);
    }
});



//특정 사용자에 대한 게시글 목록
//GET /posts
router.get('/:userId/posts', async (req, res, next) => {

    try {
        console.log(" 특정 사용자에 대한 게시글 목록  :", req.query.lastId);
        const where = { UserId: req.params.userId };
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





//passport.authenticate 미들웨어는 (req, res, next) 사용할수 없는 미들웨어인데 다음과 미들웨어 확장 같은 설정으로 사용
//POST  /user/login
router.post('/login', isNotLoggedIn, (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            console.error("1.로그인 에러 ", err);
            next(err);
        }

        //현재 info 가 존재하면 클라이언트 에러 메시지 반환처리
        //info  예  => { reason: '존재하지 않는 사용자입니다.' } { reason: '비밀번호가 틀렸습니다.' }
        if (info) {
            //401 허가되지 않음 403 금지
            return res.status(401).send(info.reason);
        }

        return req.login(user, async (loginErr) => {

            if (loginErr) {
                return next(loginErr);
            }

            const fullUserWithoutPassword = await User.findOne({
                where: {
                    id: user.id
                },
                //원하는 정보만 attributes: ['id', 'nickname', 'email'],
                attributes: {
                    exclude: ['password'],

                },
                include: [{
                    model: Post,
                    attributes: ['id']
                }, {
                    model: User,
                    as: "Followers",
                    attributes: ['id']
                },
                {
                    model: User,
                    as: "Followings",
                    attributes: ['id']
                }
                ]
            })

            return res.status(200).json(fullUserWithoutPassword)
        });

    })(req, res, next);
});



//로그아웃
router.post('/logout', isLoggedIn, (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.session.destroy();
        res.send('ok')
    });
});



//회원 가입
router.post('/', isNotLoggedIn, async (req, res, next) => {

    try {
        console.log(" 백엔드 : ", req.body);

        const exUser = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디 입니다.');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword
        });

        //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060'); //특정서버
        // res.setHeader('Access-Control-Allow-Origin', '*'); //모든서버
        res.status(201).send('ok');

    } catch (error) {
        console.error(" 회원 가입 error : ", error);
        next(error); //status 500
    }
});



router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try {
        await User.update({
            nickname: req.body.nickname,
        }, {
            where: {
                id: req.user.id
            }
        });
        res.status(200).json({ nickname: req.body.nickname })
    } catch (error) {
        console.error(error);
        next(error);
    }
})


//팔로우 추가
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => { //PATCH  /user/1/follow
    try {
        const user = await User.findOne({ where: { id: req.params.userId } });
        if (!user) {
            res.status(403).send('없은 사람을 팔로우하려고 하시네요?');
        }

        await user.addFollowers(req.user.id)
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) })
    } catch (error) {
        console.error(error);
        next(error);
    }

});


//팔로우 취소 ==> 팔로잉 제거
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => { //DELETE  /user/1/follow
    try {
        const user = await User.findOne({ where: { id: req.params.userId } });
        console.log(" 팔로잉 제거  : ", req.params.userId);

        if (!user) {
            res.status(403).send('없은 사람을 제거하려고  하시네요?');
        }
        //const me = await User.findOne({ where: { id: req.user.id } });
        //제거 하려는 아이디 req.params.userId  이다.
        //현재 접속 한 나의 아이디는  패스포트로 req.user.id 이다.
        //따라서, and  조건으로 findOne me 가져오고 으로 제거하려는 req.params.userId  넣으면 된다.
        //DELETE FROM `Follow` WHERE `FollowerId` = 2 AND `FollowingId` IN (1)
        //await me.removeFollowings(req.params.userId);

        //=>  반대로 팔로워 제거로 해도 된다.
        await user.removeFollowers(req.user.id);

        res.status(200).json({ UserId: parseInt(req.params.userId, 10) })
    } catch (error) {
        console.error(error);
        next(error);
    }
});


//팔로우 차단 => 팔로워 제거
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => { //DELETE  /user/1/follow
    try {
        console.log(" 팔로워 제거  : ", req.params.userId);
        const user = await User.findOne({ where: { id: req.params.userId } });
        if (!user) {
            res.status(403).send('없은 사람을 팔로우차단 하려고 하시네요?');
        }
        // const me = await User.findOne({ where: { id: req.user.id } });
        // await me.removeFollowers(req.params.userId);

        //=>  반대로 팔로잉 제거로 한번만 실행 처리
        await user.removeFollowings(req.user.id);

        res.status(200).json({ UserId: parseInt(req.params.userId, 10) })
    } catch (error) {
        console.error(error);
        next(error);
    }
});






//팔로워 불러워기
router.get('/followers', isLoggedIn, async (req, res, next) => { //get  /user/followers
    try {
        //패스포트에 로그인한 user id  값 :  req.user.id
        const user = await User.findOne({ where: { id: req.user.id } });
        const followers = await user.getFollowers();
        res.status(200).json(followers)
    } catch (error) {
        console.error(error);
        next(error);
    }
});



// 팔로잉 불러워기 시퀄라이즈에서 다음과 같이 Followings  처리를 해서  getFollowings 적용 됨
router.get('/followings', isLoggedIn, async (req, res, next) => { //get  /user/followings
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        const followings = await user.getFollowings();
        res.status(200).json(followings);
    } catch (error) {
        console.error(error);
        next(error);
    }
});




module.exports = router;
