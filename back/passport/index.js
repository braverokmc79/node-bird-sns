const passport = require('passport');
const local = require('./local');
const { User } = require('../models');


module.exports = () => {

    passport.serializeUser((user, done) => {
        //메모리에 많은 양의 데이터를 저장하면  메모리 낭비가 심하므로 user id 만 저장 한다.
        done(null, user.id);
    });


    //user id 를 통해 user 정보를 가져온다.
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({ where: { id } })
            done(null, user); //req.user 저장
        } catch (error) {
            console.error(" passport.deserializeUser error : ", error);
            done(error);
        }
    });


    local();

}