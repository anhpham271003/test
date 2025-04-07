import * as httpRequest from '~/utils/httpRequest';

export const getOrigin = async () => {
    try {
        return await httpRequest.get('/origins'); // Thay đổi URL tùy theo API của bạn
    } catch (err) {
        console.log(err);
        throw err;
    }
};
