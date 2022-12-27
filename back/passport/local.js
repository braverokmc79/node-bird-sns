const passport = require('passport');
const { Strategy: LocalStrategey } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');


module.exports = () => {
    passport.use(new LocalStrategey({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {

        try {

            const user = await User.findOne({
                where: { email }
            });

            if (!user) {
                return done(null, false, { reason: '존재하지 않는 사용자입니다.' })
            }

            const result = await bcrypt.compare(password, user.password);
            if (!result) {
                return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
            }

            return done(null, user);

        } catch (error) {
            console.error(" 로그인 에러 : ", error);
            return done(error);
        }

    }));

}

