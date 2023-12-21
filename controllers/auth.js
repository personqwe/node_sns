const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require("passport");

exports.join = async (req, res, next) => {
    const {nick, email, password} = req.body;
    try {
        const exUser = await User.findOne({ where: {email}});
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12); // 높을수록 느림 암호화
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/'); // 302
    } catch (error) {
        console.error(error);
        next(error);
    }
}

//POST /auth/login
exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) { // 로직 실패
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => { // 로그인 성공
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 확장패턴, localStrategy 사용 done이 호출되었을 때 가는 곳
};

exports.logout = (req, res, next) => { // 브라우저 connect.sid가 남아있어도 로그인 안됨 {세션쿠키: id} 이것을 {} 이렇게 지워주는 것
    req.logout(() => {
        res.redirect('/');
    })
}