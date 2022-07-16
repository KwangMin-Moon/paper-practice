const express = require('express');
const createError = require('../modules/custom_error');
const PaperService = require('../services/paper.service');
const validate_paper = require('../modules/validate_paper');
const { Paper } = require('../models');

// 메인 페이지 조회 & 게시글 검색
const readMain = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    if (keyword) {
      const papers = await PaperService.findPostBy(keyword);
      return res.json({ papers });
    }
    const papers = await PaperService.findAllPosts();
    const popularUsers = await PaperService.findBestUsers();
    return res.json({ papers, popularUsers });
  } catch (err) {
    return next(err);
  }
};

exports.readMain = readMain;
