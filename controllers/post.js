const Hashtag = require("../models/hashtag");
const Post = require("../models/post");

exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({url: `/img/${req.file.filename}`});
}; //json으로 이미지 업로드가 끝나면 업로드 된 이미지 url을 프론트로 보내고 프론트에서 게시글 업로드 할 때 url을 같이 보냄

exports.uploadPost = async (req, res, next) => {
    // req.body.content, req.body.url
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if(hashtags) {
           const result = await Promise.all(hashtags.map((tag) => {
                return Hashtag.findOrCreate({
                    where: { title: tag.slice(1).toLowerCase() } // #을 떼려고 slice 
                }); //기존 해시태그가 있으면 걔를 찾아오고 없으면 새로 만들어서 찾아옴. 결국 한가지를 가져옴
            }));
            console.log('result', result);
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
};

