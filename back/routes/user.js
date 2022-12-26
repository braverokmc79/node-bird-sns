const express = require('express');
const { User } = require('../models');
const bcrypt = require('bcrypt');

const router = express.Router();


router.get('/', (req, res) => {
    // User.create
    console.log(" get 백엔드 : ", req.body);
    res.json({ success: true })
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
