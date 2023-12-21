const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => { // exUser
        done(null, user.id); // user id만 추출
    });
    // 세션 {1234578964: 1} = {세션쿠키(랜덤): 유저아이디} -> 메모리에 저장
    // 서비스가 커지면 서버를 여러대 사용. 메모리를 공유하기 위해 메모리 서버를 따로 둔다.
    passport.deserializeUser((id, done) => { // id: 1 이를 통해 유저정보를 복원
        User.findOne({where: {id}})
        .then((user) => done(null, user)) //req.user, req.session 사용자 조회를 통해 데이터가 복원되어 사용 가능
        .catch(err => done(err)); // connect.sid 쿠키로 세션에서 찾을 때 req.session이 생성
    });

    local(); //
}