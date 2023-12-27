const Post = require('../models/post');
const User = require('../models/user');

exports.like = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.postid, 10);
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) {
            await user.addLikedPost(postId);
            const post = await Post.findByPk(postId);
            if (post) {
                await post.increment('likecount', { by: 1 });
                res.send('success');
            } else {
                res.status(404).send('Post not found');
            }
        } else {
            res.status(404).send('No user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};