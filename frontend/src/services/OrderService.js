import * as httpRequest from '~/utils/httpRequest';

export const getOrder = async (userId) => {
    try {
        return await httpRequest.get(`/order/${userId}`);
    } catch (err) {
        console.log(err);
        throw err;
    }
};
