import * as httpRequest from '~/utils/httpRequest';

export const getManufacturer = async () => {
    try {
        return await httpRequest.get('/manufacturers'); // Thay đổi URL tùy theo API của bạn
    } catch (err) {
        console.log(err);
        throw err;
    }
};
