//const { idText } = require('typescript');
const { User, Booking, Leaf } = require('../models');
const { findAll } = require('../models/booking');

//예약시간 조회
const findRev = async (hostId, bookingTime, meetingDate) => {
  return await Booking.findAll({
    where: {
      hostId: hostId,
      time: bookingTime,
      date: meetingDate,
    },
  });
};
exports.findRev = findRev;

//예약 신청
const createBooking = async (
  userId,
  guestId,
  leaf,
  hostId,
  bookingTime,
  meetingDate
) => {
  console.log(14, userId, guestId, leaf, hostId, bookingTime, meetingDate);

  await User.decrement({ point: leaf }, { where: { userId: guestId } });
  return await Booking.create({
    hostId,
    date: meetingDate,
    time: bookingTime,
    guestId,
    leaf,
  });
};
exports.createBooking = createBooking;

//게스트(신청자)예약 보기
const inquireBooking = async (userId) => {
  return await Booking.findAll({
    where: { guestId: Number(userId) },
    order: [['createdAt', 'DESC']],
  });
};
exports.inquireBooking = inquireBooking;

//호스트(주최자)예약보기
const hostInquireBooking = async (userId) => {
  return await Booking.findAll({
    where: { hostId: Number(userId) },
    order: [['createdAt', 'DESC']],
  });
};
exports.hostInquireBooking = hostInquireBooking;
