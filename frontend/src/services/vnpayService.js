import * as httpRequest from '~/utils/httpRequest';

export const createPaymentUrl = async ({ amount, items, userId }) => {
    try {
    console.log('Dữ liệu gửi đến VNPay:', { amount, items, userId });
      const res = await httpRequest.post('/vnpay/create-payment-url', {
        amount,
        items,
        userId,
      });
      console.log('Response từ server:', res);
      return res;
    } catch (err) {
      console.error('Lỗi tạo payment URL:', err);
      throw err;
    }
  };