const express = require('express');
const postRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const cors = require('cors');
const db = require('./models');
const passportConfig = require('./passport');
const passport = require('passport');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');


dotenv.config();
const app = express();


db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch(console.error);

app.use(cors({
    //origin: 'https://nodebird.com'
    origin: true, // orign: true 로 설정해두면 * 대신 보낸 곳의 주소가 자동으로 들어가 편리합니다.
    credentials: false
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

app.get('/api', (req, res) => {
    res.send('hello api');
});

app.get('/api/posts', (req, res) => {
    res.json([
        { id: 1, content: 'hello1' },
        { id: 2, content: 'hello2' },
        { id: 3, content: 'hello3' }
    ])
});

app.use('/post', postRouter);
app.use('/user', userRouter);



app.listen(3065, () => {
    console.log("서버 실행 중");
});


