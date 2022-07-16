const { Op } = require('sequelize');
const { Paper, User, Comment, Image, Tag } = require('../models');
const calcOneWeek = require('../modules/date');

// 키워드로 게시글 검색
const findPostsBy = async (keyword) => {
  return await Paper.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${keyword}%` } },
        { contents: { [Op.like]: `%${keyword}%` } },
      ],
    },
    order: [['createdAt', 'DESC']],
  });
};

exports.findPostsBy = findPostsBy;

// 1주일간 좋아요 순으로 게시글 11개 검색
const findAllPosts = async () => {
  const papers = await Paper.findAll({
    limit: 11,
    include: { model: User, as: 'Likes' },
  });
  const papersByLike = papers
    .map((paper) => {
      const { postId, userId, title, thumbnail, Likes } = paper;
      const likes = Likes.filter(
        (like) => new Date(like.createdAt) > calcOneWeek()
      ).length;
      return { postId, userId, title, thumbnail, likes };
    })
    .sort((a, b) => b.likes - a.likes);
  return papersByLike;
};
exports.findAllPosts = findAllPosts;

// 인기도 순으로 유저 18명 검색
const findBestUsers = async () => {
  return await User.findAll({
    order: [['popularity', 'DESC']],
    limit: 18,
    attributes: ['userId', 'nickname', 'profileImage', 'popularity'],
  });
};
