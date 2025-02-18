const express = require('express');
const { isLoggedIn } = require('../middlewares');
const router = express.Router();
const { follow, unfollow, updatenick } = require('../controllers/user');

router.post('/:id/follow', isLoggedIn, follow);
router.post('/:id/unfollow', isLoggedIn, unfollow);
router.post('/:id/updatenick', isLoggedIn, updatenick);

module.exports = router;