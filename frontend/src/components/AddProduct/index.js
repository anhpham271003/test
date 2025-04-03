// src/components/AddProduct.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [form, setForm] = useState({
        productName: '',
        productSlug: '',
        productShortDescription: '',
        productDescription: '',
        productSoldQuantity: 0,
        productAvgRating: 0,
        productImgs: [],
        productDetails: [],
        productVariants: [],
        categories: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post('http://localhost:5000/api/products', form)
            .then((res) => {
                alert('Thêm sản phẩm thành công!');
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
                alert('Lỗi khi thêm sản phẩm');
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Tên sản phẩm"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
            />
            <input
                type="text"
                placeholder="Slug"
                value={form.productSlug}
                onChange={(e) => setForm({ ...form, productSlug: e.target.value })}
            />
            <textarea
                placeholder="Mô tả ngắn"
                value={form.productShortDescription}
                onChange={(e) => setForm({ ...form, productShortDescription: e.target.value })}
            />
            <textarea
                placeholder="Mô tả"
                value={form.productDescription}
                onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
            />
            <input
                type="number"
                placeholder="Số lượng đã bán"
                value={form.productSoldQuantity}
                onChange={(e) => setForm({ ...form, productSoldQuantity: parseInt(e.target.value) })}
            />
            <input
                type="number"
                placeholder="Đánh giá trung bình"
                value={form.productAvgRating}
                onChange={(e) => setForm({ ...form, productAvgRating: parseFloat(e.target.value) })}
            />
            <button type="submit">Thêm sản phẩm</button>
        </form>
    );
};

export default AddProduct;
