import * as httpRequest from '~/utils/httpRequest';

export const createOrder = async (orderData) => {
  try {
    const res = await httpRequest.post('/checkout', orderData);
    return res;
  } catch (error) {
    console.error('❌ Lỗi khi gửi đơn hàng:', error);
    throw error;
  }
};
