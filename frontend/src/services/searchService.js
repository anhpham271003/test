import * as httpRequest from '~/utils/httpRequest';

export const search = async (q) => {
    try {
        const res = await httpRequest.get('products/search', {
            params: {
                q,
            },
        });
        return res;
    } catch (err) {
        console.log(err);
    }
};
