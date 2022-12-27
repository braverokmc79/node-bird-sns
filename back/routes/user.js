const express = require('express');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();

//passport.authenticate 미들웨어는 (req, res, next) 사용할수 없는 미들웨어인데 다음과 미들웨어 확장 같은 설정으로 사용
//POST  /user/login
router.post('/login', (req, res, next) => {

    console.log("로그인  ", req.body);

    passport.authenticate('local', (err, user, info) => {

        if (err) {
            console.error(err);
            console.error("1.로그인 에러 ", err);
            next(err);
        }
        //현재 info 가 존재하면 클라이언트 에러
        //info  예  => { reason: '존재하지 않는 사용자입니다.' } { reason: '비밀번호가 틀렸습니다.' }
        if (info) {
            //401 허가되지 않음 403 금지
            return res.status(401).send(info.reason);
        }


        console.log("3 passport .req.login  실행  : ", user);

        return req.login(user, async (loginErr) => {
            console.log("로그인 처리 ");

            if (loginErr) {
                console.error("2.로그인 에러 ", loginErr);
                return next(loginErr);
            }

            console.log("로그인 성공 :  ", user);
            return res.status(200).json(user)
        });

    })(req, res, next);

});



//로그아웃
router.post('/logout', (req, res, next) => {
    console.log(" 로그 아웃웃");
    req.logout();
    req.session.destroy();
    res.send('ok');
});


router.post('/', async (req, res, next) => {

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
