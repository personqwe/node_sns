const express = require('express');
const passport = require('passport');
const { isLoggendIn, isNotLoggenIn } = require('../middlewares');
const {join, login, logout} = require('../controllers/auth');
const router = express.Router();

///auth/jogin
router.post('/join', isNotLoggenIn, join);

router.post('/login', isNotLoggenIn, login);

router.get('/logout', isLoggendIn, logout);

module.exports = router;