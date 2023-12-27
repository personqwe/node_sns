const User = require("../models/user")

exports.follow = async (req, res, next) => {
  // req.user.id, req.params. id
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.unfollow = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.removeFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.updatenick = async (req, res, next) => {
  try {
      const user = await User.findOne({ where: { id: req.user.id } });
      if (user) {
          await user.update({ nick: req.body.newNickname });
          res.send('success');
      } else {
          res.status(404).end('no user');
      }
  } catch (error) {
      console.error(error);
      next(error);
  }
}