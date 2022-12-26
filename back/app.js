const express = require('express');
const postRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const db = require('./models');
const app = express();

db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch(console.error);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



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


