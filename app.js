const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport'); //클라이언트가 서버에 요청할 자격이 있는지 인증 passport/index.js의 module.exports를 불러옴

// process.env.COOKIE_SECRET 없음
dotenv.config(); // process.env
// process.env.COOKIE_SECRET 있음
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const likeRouter = require('./routes/like');
const { sequelize } = require('./models');
const passportConfig = require('./passport'); // passport설정

const app = express();
passportConfig(); // passport 실행
app.set('port', process.env.PORT || 8080);
app.set('view engine', 'html'); // 페이지 확장자
nunjucks.configure('views', {
    express: app,
    watch: true,
});

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev')); // 배포할땐 combined
app.use(express.static(path.join(__dirname, 'public'))); //public폴더만 프론트에서 허용 브라우저에서는 원래 접근 X
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json()); // req.body를 ajax json 요청으로부터
app.use(express.urlencoded({ extended: false })); // 폼 요청 req.body 폼으로부터
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키 전송 처리
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true, // 자바스크립트 접근 못하게(보안에 좋음)
        secure: false, // https 적용할 때 true
    },
}));

// 세션쿠키랑 유저 아이디는 연결되어있다.
app.use(passport.initialize()); // passport는 session 아래에 작성해야함 req.user, req.login, req.isAuthenticate, req.logout 여기서 생성
app.use(passport.session()); // user.id를 저장한게 session으로 저장. Connect.id로 session쿠키가 브라우저로 전송
// 브라우저 connect.sid=123456412348 - 쿠키가 서버로 옴 
app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/like', likeRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
