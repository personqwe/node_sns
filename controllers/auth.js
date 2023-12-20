const User = require("../models/user");
const bcrypt = require('bcrypt');

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

exports.login = (req, res, next) => {
    const {} = req.body;
}

exports.logout = (req, res, next) => {
    const {} = req.body;
}