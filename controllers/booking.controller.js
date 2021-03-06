const bookingService = require('../services/booking.service');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

//예약 신청
const createBooking = async (req, res) => {
  const userId = res.locals.user.userId;

  const { leaf, guestId, date } = req.body;
  const hostId = req.params.userId;

  //날짜, 시간 설정
  const start = date.split('-')[0];
  const end = date.split('-')[1];
  const bookingMoment = new dayjs();
  const startMoment = dayjs(start);
  const time = startMoment.diff(bookingMoment, 'minute');
  const meetingDate = dayjs(start).format('YYYY-MM-DD ddd');
  const startTime = dayjs(start).tz().format('HH:mm:ss');
  const endTime = dayjs(end).tz().format('HH:mm:ss');
  const bookingTime = `${startTime} - ${endTime}`;

  //예약시간 제한
  if (time < 180) {
    res
      .status(400)
      .send({ msg: '화상 채팅 3시간 전까지만 예약이 가능합니다.' });
    return;
  }

  console.log(01, userId, guestId, leaf, hostId, bookingTime, meetingDate);

  // 호스트id, 예약시간, 예약날짜 조회
  const existRev = await bookingService.findRev(
    hostId,
    bookingTime,
    meetingDate
  );
  if (existRev.length > 0) {
    return res.send({ msg: '이미 예약된 시간 입니다.' });
  }

  // 유저 나뭇잎 조회
  const userPoint = res.locals.user.point;
  if (userPoint < 5) {
    return res.send({ msg: '나뭇잎이 부족합니다.' });
  }

  //본인 예약 차단
  if (hostId == guestId) {
    return res.status(400).send({ result: false });
  }

  //예약 신청
  try {
    const booking_result = await bookingService.createBooking(
      userId,
      guestId,
      leaf,
      hostId,
      bookingTime,
      meetingDate
    );
    return res.status(200).json({ booking_result, result: true });
  } catch (error) {
    console.log(error);
  }
};
exports.createBooking = createBooking;

//예약 조회
const inquireBooking = async (req, res) => {
  const userId = res.locals.user.userId;

  try {
    const hostResult = await bookingService.hostInquireBooking(userId);
    const inquireResult = await bookingService.inquireBooking(userId);
    return res.status(200).json({ inquireResult, hostResult, result: true });
  } catch (error) {
    console.log(error);
  }
};
exports.inquireBooking = inquireBooking;
