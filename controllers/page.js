const Post = require("../models/post");
const User = require("../models/user");

exports.renderProfile = (req, res, next) => {
    // 서비스를 호출
    res.render('profile', {title: '내 정보 - NodeBird'}); // res.render, res.locals는 합쳐져서 프론트로 넘어감
};


exports.renderJoin = (req, res, next) => {
    res.render('join', {title: '회원 가입 - NodeBird'});
};

exports.renderMain = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
          include: {
            model: User,
            attributes: ['id', 'nick'],
          },
          order: [['createdAt', 'DESC']],
        });
        res.render('main', {
          title: 'NodeBird',
          twits: posts,
        });
      } catch (err) {
        console.error(err);
        next(err);
      }
    };
// 라우터 -> 컨트롤러(요청, 응답 앎) -> 서비스(요청, 응답 모름) 호출순서