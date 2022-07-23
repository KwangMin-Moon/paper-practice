const express = require('express');
const { isNotLoggedIn } = require('../middlewares/loging');
const router = express.Router();
const Usercontroller = require('../controllers/user.controller');

require('dotenv').config();

// 회원가입
router.post('/signup', Usercontroller.signup);

// 로그인
router.post('/login', Usercontroller.login);

// 이메일 || 닉네임 중복검사
router.post('/idcheck', isNotLoggedIn, Usercontroller.duplicate);

module.exports = router;
