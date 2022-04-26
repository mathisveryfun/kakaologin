const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
  // res.locals : req의 라이프타임동안 유효한 변수이며 html/view 클라이언트 사이드로 변수들을 보낼 수 있다.
  // 참조 : https://rat2.tistory.com/18
  res.locals.user = null,
  res.locals.followerCount = 0.
  res.locals.followingCount = 0,
  res.locals.followerIdList = [];
  next();
});

// 렌더링 하겠다.
router.get('/profile', (req, res) => {
  res.render('profile', { title: '내 정보 - Jeong프로파일' });
})

router.get('./join', (req, res) => {
  res.render('join', { title: '회원가입 - Jeong회원' });
});

router.get('/', (req, res, next) => {
  const twits = [];
  res.render('main', { 
    title: '타이틀',
    twits,
  });
});

module.exports = router;