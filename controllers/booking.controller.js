const bookingService = require('../services/booking.service');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

class SetTime {
  constructor(start, end) {
    this.bookingMoment = new dayjs().tz();
    this.startMoment = dayjs(start).tz();
    this.time = startMoment.diff(bookingMoment, 'minute');
    this.meetingDate = dayjs(start).format('YYYY-MM-DD ddd');
    this.startTime = dayjs(start).tz().format('HH:mm:ss');
    this.endTime = dayjs(end).tz().format('HH:mm:ss');
    this.bookingTime = `${startTime} - ${endTime}`;
  }

  timeLimit() {
    if (this.time < 180) {
      res
        .status(400)
        .send({ msg: '화상 채팅 3시간 전까지만 예약이 가능합니다.' });
      return;
    }
  }
}

//예약 신청
const createBooking = async (req, res) => {
  const { userId, blogId } = res.locals.user;

  const { start, end } = req.body;
  const guestId = blogId;
  const hostId = req.params.blogId;

  const setDate = new SetTime(start, end);
  setDate.timeLimit();

  // // 호스트id, 예약시간, 예약날짜 조회
  // const existRev = await bookingService.findRev(
  //   hostId,
  //   bookingTime,
  //   meetingDate
  // );
  // if (existRev.length > 0) {
  //   return res.send({ msg: '이미 예약된 시간 입니다.' });
  // }

  // // 유저 나뭇잎 조회
  // const userPoint = res.locals.user.point;
  // if (userPoint < 5) {
  //   return res.send({ msg: '나뭇잎이 부족합니다.' });
  // }

  //본인 예약 차단
  if (hostId == guestId) {
    return res.status(400).send({ result: false });
  }

  //예약 신청
  try {
    const booking_result = await bookingService.createBooking(
      blogId,
      leaf,
      hostId,
      start,
      end,
      userId
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
