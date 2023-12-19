const express = require('express');
const router = express.Router();
const { renderJoin, renderMain, renderProfile } = require('../controllers/page');

router.use((req, res, next) => {
    res.locals.user = null; // locals는 따로 저장할 데이터를 담아둠(공통적으로 사용할 데이터)
    res.locals.followerCount = 0;
    res.locals.folloingCount = 0;
    res.locals.followingIdList = [];
    next();
})

router.get('/profile', renderProfile);
router.get('/join', renderJoin);
router.get('/', renderMain); //라우터의 마지막 미들웨어는 컨트롤러

module.exports = router;