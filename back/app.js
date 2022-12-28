const express = require('express');
const cors = require('cors');
const db = require('./models');
const passportConfig = require('./passport');
const passport = require('passport');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');


dotenv.config();
const app = express();


db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch(console.error);

app.use(cors({
    //origin: 'https://nodebird.com'
    // origin: true, // orign: true 로 설정해두면 * 대신 보낸 곳의 주소가 자동으로 들어가 편리합니다.
    origin: "http://localhost:3060",
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); //패스포트 초기화
app.use(passport.session());


passportConfig();






app.get('/', (req, res) => {
    res.send('hello express');
});


app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);





//에러처리 미들웨어
// app.use((err, req, res, next) => {

// });



app.listen(3065, () => {
    console.log("서버 실행 중");
});


