import * as httpRequest from '~/utils/httpRequest';

export const getPaymentMethod = async () => {
    try {
        return await httpRequest.get('/payment-method'); // Gọi backend API
    } catch (err) {
        console.log(err);
        throw err;
    }
};
