const express = require('express');
const router = express.Router();
const { renderJoin, renderMain, renderProfile } = require('../controllers/page');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

router.use((req, res, next) => {
    res.locals.user = req.user; // 로그인 안하면 null locals는 따로 저장할 데이터를 담아둠(미들웨어간 공유되는 데이터)
    res.locals.followerCount = 0;
    res.locals.folloingCount = 0;
    res.locals.followingIdList = [];
    // req.session은 사용자끼리 공유되는 데이터(사용자가 로그아웃 시 데이터 삭제)
    next();
})

router.get('/profile', renderProfile);
router.get('/join', renderJoin);
router.get('/', renderMain); //라우터의 마지막 미들웨어는 컨트롤러

module.exports = router;