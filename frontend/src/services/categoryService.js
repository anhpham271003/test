import * as httpRequest from '~/utils/httpRequest';

export const getCategories = async () => {
    try {
        return await httpRequest.get('/categories');
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const getProductsByCategories = async (id) => {
    try {
        return await httpRequest.get(`/categories/${id}`);
    } catch (err) {
        console.log(err);
        throw err;
    }
};
