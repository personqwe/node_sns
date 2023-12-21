const passport = require('passport');
const {Strategy: localStrategy} = require('passport-local');
const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = () => {
    passport.use(new localStrategy({
        usernameField: 'email', //req,body.email
        passwordField: 'password', //req.body.password
    }, async (email, password, done) => { // done(서버실패, 성공유저, 로직실패)
        try {
            const exUser = await User.findOne({ where: {email}});
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password); // 암호화랑 비교를 알아서 해줌 왼쪽은 사용자 오른쪽은 db
                if(result) {
                    done(null, exUser); //성공했을 때 db에 있는 사용자 정보를 넣어준다.
                }
                else {
                    done(null, false, {message: '비밀번호가 일치하지 않습니다.'}); // 로그인 실패한 이유
                }
            } else {
                done(null, false, {message: '가입되지 않은 회원입니다.'}); // 로그인 실패한 이유
            }
        } catch(error) {
            console.error(error);
            done(error); // 서버실패
        }
    }));
};



//로그인 판단 파일