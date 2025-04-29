import * as httpRequest from '~/utils/httpRequest';

export const getCart= async () => {
    try {
        return await httpRequest.get("/carts");
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const addCart = async (carts) => {
    try {
        return await httpRequest.post('/carts', carts, );
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const updateCart = async (id, carts) => {
    try {
        return await httpRequest.put(`/carts/${id}`, carts);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const deleteCartById= async (id) => {
    try {
        return await httpRequest.del(`/carts/${id}`);
    } catch (err) {
        console.log(err);
        throw err;
    }
};