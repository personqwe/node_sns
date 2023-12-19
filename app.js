const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
// process.env.COOKIE_SECRET 없음
dotenv.config(); // process.env
// process.env.COOKIE_SECRET 있음
const pageRouter = require('./routes/page');

const app = express();
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
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // 폼 요청
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

app.use('/', pageRouter);

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
