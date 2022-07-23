const express = require('express');
const PaperController = require('../controllers/paper.controller');
const auth = require('../middlewares/auth');
const router = express.Router();
const asyncHandler = require('../middlewares/async.handler');

// 메인 페이지 조회 & 게시글 검색
router.get('/', asyncHandler(PaperController.readMain));

// 미니 프로필 조회
router.get('/miniprofile', auth, asyncHandler(PaperController.readMiniProfile));

module.exports = router;
