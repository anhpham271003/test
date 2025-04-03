import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:5000/api/products')
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <h2>Danh sách sản phẩm</h2>
            <ul>
                {products.map((p) => (
                    <li key={p._id}>
                        <h3>{p.product_name}</h3>
                        {/* <img src={p.product_imgs[0]?.link} alt={p.product_imgs[0]?.alt} width="200" /> */}
                        <p>{p.product_short_description}</p>
                        {/* <p>Giá: {p.product_variants[0]?.price?.toLocaleString()} VND</p> */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
