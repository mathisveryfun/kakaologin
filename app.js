const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();
const pageRouter = require('./routes/page');

const app = express();
// app이라는 객체에 port라는 키의 값을 4000으로 줄거다.
// 이거 부를때는 app.set(키) 이나 req.app.set(키) 로 값 불러올수 있음
// 참조 : https://rat2.tistory.com/9
app.set('port', process.env.PORT || 4000);
app.set('view engine', 'html');
// views 폴더에 넌적 생성.
// 참조 : https://inpa.tistory.com/entry/Nunjucks-%F0%9F%93%9A-%EB%84%8C%EC%A0%81%EC%8A%A4-%EB%AC%B8%EB%B2%95-%EC%A0%95%EB%A6%AC
nunjucks.configure('views', {
  express: app,
  watch: true, // true로 주면 html이 변경될떄 템플릿을 reload 함
});
sequelize.sync({
  force: false
})
.then(() => {
  console.log('데이터베이스 연결 성공');
})
.catch((err) => {
  console.error(err);
})

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // ?
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  // https://fierycoding.tistory.com/36
  // resave는 모든req 마다 기존의 변경사항이 없을때에도 세션을 다시 저장할건지 => false로 바꿔 효율성 높임.
  // saveUni 어쩌구는 이해 불가 그냥 이것도 서버 효율성
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use('/', pageRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
})

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});