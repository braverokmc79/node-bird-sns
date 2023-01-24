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
const hashRouter = require('./routes/hashtag');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');
const morgan = require('morgan');


dotenv.config();
const app = express();


db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch(console.error);



//express 에 static 함수가 존재   path.join 을 하면 운영체제 상관없이 경로설정을 잡아준다.
app.use('/', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());



app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        httpOnly: true,
        secure: false,
        //**쿠키를 저장할 도메인 설정
        //http://192.168.120.136/
        //domain: process.env.NODE_ENV === 'production' && '.mynodebird.com'
        domain: process.env.NODE_ENV === 'production' && 'macaronics.iptime.org'
    }
}));


app.use(passport.initialize()); //패스포트 초기화
app.use(passport.session());


passportConfig();


if (process.env.NODE_ENV === 'production') {
    //app.set('trust proxy', 1);

    console.log(" production 실행 ");
    app.use(morgan('combined'));
    app.use(hpp());
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(cors({
        //origin: 'https://nodebird.com'
        // origin: true, // orign: true 로 설정해두면 * 대신 보낸 곳의 주소가 자동으로 들어가 편리합니다.
        //프론트 URL 주소
        origin: ["http://localhost:3060",
            "http://macaronics.iptime.org",
            "http://macaronics.iptime.org:3060",
            "https://mesns.vercel.app",
            "https://mesns-braverokmc79.vercel.app/"],
        credentials: true
    }));

} else {
    console.log(" dev 실행 ");
    app.use(morgan('dev'));
    app.use(cors({
        //origin: 'https://nodebird.com'
        // origin: true, // orign: true 로 설정해두면 * 대신 보낸 곳의 주소가 자동으로 들어가 편리합니다.
        origin: true,
        credentials: true  //사용ㅇ자 인증이 필요한 리소스 (쿠키, ... 등) 접근
    }));
}




app.get('/', (req, res) => {
    res.send('hello express');
});


app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashRouter);



//에러처리 미들웨어
// app.use((err, req, res, next) => {

// });



app.listen(3065, () => {
    console.log("서버 실행 중");
});


