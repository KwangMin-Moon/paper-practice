const express = require('express');
const { router } = require('../app');
const PaperController = require('../controllers/paper.controller');
const auth = require('../middleware/auth');
const route = express.Router();

// 메인 페이지 조회 & 게시글 검색
router.get('/', PaperController.readMain);

module.exports = route;
