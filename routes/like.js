const express = require('express');
const {isLoggedIn} = require('../middlewares');
const router = express.Router();
const {like, unlike} = require('../controllers/like');

router.post('/:postid/like', isLoggedIn, like);
router.post('/:postid/unlike', isLoggedIn, unlike);

module.exports = router;