import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Image from '~/components/Image';
import styles from './ProductItem.module.scss';

const cx = classNames.bind(styles);

ProductItem.propTypes = {
    data: PropTypes.object.isRequired,
    type: PropTypes.string, // 'full', 'compact', 'half-full'
};

function ProductItem({ data, type = 'full' }) {
    // Tính giá sau khi áp dụng giảm giá
    const finalPrice = data.productSupPrice
        ? data.productUnitPrice * (1 - data.productSupPrice / 100)
        : data.productUnitPrice;

    return (
        <Link to={`/product/${data._id}`} className={cx('wrapper', type)}>
            <Image
                className={cx('avatar')}
                src={data.productImgs?.[0] ? data.productImgs[0] : ''}
                alt={data.productName}
            />
            <div className={cx('info')}>
                <h3 className={cx('name')}>{data.productName}</h3>
                {type === 'compact' && <p className={cx('price')}>Price: ${finalPrice.toFixed(2)}</p>}
                {type === 'half-full' && (
                    <div className={cx('content')}>
                        <p className={cx('price')}>Price: ${finalPrice.toFixed(2)}</p>
                        <div className={cx('rating')}>
                            <p className={cx('rate')}>⭐ sold</p>
                            <p className={cx('liked')}>❤️ likes</p>
                        </div>
                    </div>
                )}

                {type === 'full' && (
                    <>
                        <p className={cx('manufacturer')}>Manufacturer: {data.productManufacturer}</p>
                        <p className={cx('origin')}>Origin: {data.productOrigin}</p>
                        <p className={cx('category')}>Category: {data.productCategory}</p>
                        <p className={cx('quantity')}>Stock: {data.productQuantity}</p>
                        <p className={cx('price')}>
                            Price: <span className={cx('original-price')}>${data.productUnitPrice.toFixed(2)}</span> → $
                            {finalPrice.toFixed(2)}
                        </p>
                        <div className={cx('rating')}>
                            <p className={cx('sold')}>Sold: {data.productSoldQuantity || 0}</p>
                            <p className={cx('liked')}>❤️ likes</p>
                        </div>
                        <p className={cx('description')}>{data.productDescription}</p>
                    </>
                )}
            </div>
        </Link>
    );
}

export default ProductItem;
