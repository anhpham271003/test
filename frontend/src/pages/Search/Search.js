import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as searchServices from '~/services/searchService';

import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import config from '~/config';
import Image from '~/components/Image';

const cx = classNames.bind(styles);

function Search() {
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        if (query) {
            const fetchSearchResults = async () => {
                setLoading(true);
                const result = await searchServices.search(query);
                setSearchResult(result.products);
                setLoading(false);
            };
            fetchSearchResults();
        }
    }, [query]);

    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>Kết quả tìm kiếm: {query}</h3>
            {loading ? (
                <p>Loading...!</p>
            ) : (
                <>
                    <div className={cx('product-list')} tabIndex={-1}>
                        {searchResult.map((product) => {
                            const hasDiscount = product.productSupPrice > 0;
                            const productFinallyPrice = product.productUnitPrice * (1 - product.productSupPrice / 100);
                            return (
                                <div key={product._id} className={cx('product-item')}>
                                    <Link to={`${config.routes.productDetail.replace(':productId', product._id)}`}>
                                        <Image
                                            className={cx('product-avatar')}
                                            src={product.productImgs[0].link}
                                            alt={product.productName}
                                        />
                                    </Link>
                                    <div className={cx('product-info')}>
                                        <Link to={`${config.routes.productDetail.replace(':productId', product._id)}`}>
                                            <h3>{product.productName}</h3>
                                        </Link>
                                        <p>
                                            {hasDiscount ? (
                                                <>
                                                    <span className={cx('old-price')}>
                                                        {product.productUnitPrice.toLocaleString()} VNĐ
                                                    </span>{' '}
                                                    <span className={cx('discount-price')}>
                                                        {productFinallyPrice.toLocaleString()} VNĐ
                                                    </span>
                                                </>
                                            ) : (
                                                <span className={cx('normal-price')}>
                                                    {product.productUnitPrice.toLocaleString()} VNĐ
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

export default Search;
{
    /* <div>
            <h2>Search Results for: {query}</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {searchResult.map((product) => (
                        <div key={product._id}>
                            <h3>{product.productName}</h3>
                            <p>{product.productUnitPrice} VNĐ</p>
                        </div>
                    ))}
                </div>
            )}
        </div> */
}
