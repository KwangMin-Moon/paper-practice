const sequelize = require('sequelize');
const Bcrypt = require('bcrypt');
const { Op } = sequelize;
const { User } = require('../models');

// 회원가입
const signup = async (email, nickname, password, blogId) => {
  const duplicate = await User.findAll({
    where: { [Op.or]: { nickname, blogId } },
  });
  // blogId || 닉네임 중복 체크
  if (duplicate.length) {
    return false;
  }

  const salt = await Bcrypt.genSalt();
  const pwhash = await Bcrypt.hash(password, salt);

  await User.create({ email, nickname, password: pwhash, blogId });
};
exports.signup = signup;

// 로그인
const login = async (email) => {
  return await User.findOne({
    attributes: ['nickname', 'password', 'userId', 'email', 'deletedAt'],
    where: { email },
  });
};
exports.login = login;

// 이메일 || 닉네임 중복검사
const duplicate = async (id) => {
  return await User.findAll({
    where: {
      [Op.or]: {
        email: id,
        nickname: id,
      },
    },
  });
};
exports.duplicate = duplicate;
