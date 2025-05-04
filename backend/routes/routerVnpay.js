// routerVnpay.js
require("dotenv").config();
const express = require('express');
const router = express.Router();
const moment = require('moment');
const qs = require('qs');
const crypto = require('crypto');

const vnp_TmnCode = '4YGSJ0TT';
const vnp_HashSecret = '27SJC7ESRJIKTAMYETPH16HYBBUOUXW7';
const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const vnp_ReturnUrl = 'http://localhost:3000/payment-success';

// Mongoose model giả định
// const Order = require('../models/Order');

router.post('/create-payment-url', async (req, res) => {
  console.log('👉 API /api/vnpay/create-payment-url được gọi');
  const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  const orderId = moment(date).format('HHmmss');

  const { amount, items, userId } = req.body;

  // 👉 Lưu đơn hàng tạm vào DB
  // await Order.create({
  //   orderId,
  //   items,
  //   userId,
  //   amount,
  //   status: 'pending',
  // });

  const vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: 'Thanh toan don hang',
    vnp_OrderType: 'other',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  // Bước 2: Sắp xếp và ký
  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  // Bước 3: Gán chữ ký vào params
  sortedParams.vnp_SecureHash = signed;

  // Bước 4: Tạo URL redirect
  const redirectUrl = `${vnp_Url}?${qs.stringify(sortedParams, { encode: false })}`;

  // Trả kết quả về frontend
  res.status(200).json({
    success: true,
    redirectUrl,
  });
});

// Sắp xếp các thuộc tính theo thứ tự alphabet
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}


module.exports = router;