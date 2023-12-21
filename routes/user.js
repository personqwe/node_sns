const express = require('express');
const { isLoggedIn } = require('../middlewares');
const router = express.Router();
const { follow } = require('../controllers/user');

router.post('/:id/follow', isLoggedIn, follow);

module.exports = router;