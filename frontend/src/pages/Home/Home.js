import { useEffect, useState } from 'react';
import * as productService from '~/services/productService';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import config from '~/config';

const cx = classNames.bind(styles);

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await productService.getProducts({ params: { page, limit } });
                console.log('data: ', response.products);
                setProducts(response.products);
                setTotal(response.total);
                setLimit(response.limit);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [page, limit]);

    return (
        <div className={cx('wrapper')}>
            <h2>Danh sách sản phẩm</h2>
            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <>
                    {/* Danh sách sản phẩm */}
                    <div className={cx('product-list')}>
                        {products.map((product) => {
                            const hasDiscount = product.productSupPrice > 0;
                            const productFinallyPrice = product.productUnitPrice * (1 - product.productSupPrice / 100);
                            return (
                                <div key={product._id} className={cx('product-item')}>
                                    <Link to={`${config.routes.productDetail.replace(':productId', product._id)}`}>
                                        <img
                                            className={cx('product-avatar')}
                                            src={product.productImgs[0].link}
                                            alt={product.productName}
                                        />
                                    </Link>
                                    <div className={cx('product-info')}>
                                        <Link to={`${config.routes.productDetail.replace(':productId', product._id)}`}>
                                            <h3>{product.productName}</h3>
                                        </Link>
                                        {/* Hiển thị giá */}
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

                    {/* Phân trang */}
                    <div className={cx('pagination')}>
                        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                            Trước
                        </button>
                        <span>
                            Trang {page} / {Math.ceil(total / limit)}
                        </span>
                        <button disabled={page * limit >= total} onClick={() => setPage(page + 1)}>
                            Tiếp
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;
