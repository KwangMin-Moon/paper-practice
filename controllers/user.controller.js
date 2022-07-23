const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const nodemailer = require('nodemailer');
const userService = require('../services/user.service');
const passport = require('passport');
const { LoginSchema, SignupSchema } = require('../middlewares/login.validator');

//회원가입
const signup = async (req, res, next) => {
  try {
    const { email, nickname, password, blogId } =
      await SignupSchema.validateAsync(req.body);

    const duplicate = await userService.signup(
      email,
      nickname,
      password,
      blogId
    );
    if (duplicate === false) {
      return res.status(200).send({
        result: false,
      });
    } else {
      res.status(200).send({
        result: true,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.signup = signup;

// 로그인
const login = async (req, res, next) => {
  try {
    const { email, password } = await LoginSchema.validateAsync(req.body);
    const user = await userService.login(email);
    const passwordck = await Bcrypt.compare(password, user.password);
    const exuser = user.deletedAt;
    console.log(exuser);

    // 탈퇴한 회원
    if (exuser) {
      return res.status(400).send({
        result: false,
        msg: '탈퇴한 회원입니다',
      });
    }

    // 이메일이 틀리거나 패스워드가 틀렸을때
    if (!user || !passwordck) {
      return res.status(400).send({
        result: false,
      });
    }
    const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY, {
      expiresIn: 60 * 60 * 3, //60초 * 60분 * 3시 이므로, 3시간 유효한 토큰 발급
    });
    res.status(200).send({
      result: true,
      nickname: user.nickname,
      token,
      userId: user.userId,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.login = login;

// 이메일 || 닉네임 중복검사
const duplicate = async (req, res, next) => {
  try {
    const id = req.body.email || req.body.nickname;
    const exUser = await userService.duplicate(id);

    if (exUser[0]?.email === id || exUser[0]?.nickname === id) {
      return res.status(400).send({
        result: false,
      });
    }

    res.status(200).send({
      result: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.duplicate = duplicate;
