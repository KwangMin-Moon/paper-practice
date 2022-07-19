const express = require('express');
const PaperController = require('../controllers/paper.controller');
const auth = require('../middleware/auth');
const router = express.Router();

// 메인 페이지 조회 & 게시글 검색
router.get('/', PaperController.readMain);

module.exports = router;
