import * as httpRequest from '~/utils/httpRequest';

export const getUnit = async () => {
    try {
        return await httpRequest.get('/units'); // Thay đổi URL tùy theo API của bạn
    } catch (err) {
        console.log(err);
        throw err;
    }
};
