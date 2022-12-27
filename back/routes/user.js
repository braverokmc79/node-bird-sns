const express = require('express');
const { User, Post } = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');


//브라우저에서 새로고침 할때마다 요청처리 된다.
router.get('/', async (req, res, next) => {
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


module.exports = router;
