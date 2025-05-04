import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as productServices from '~/services/productService';
import * as cartService from '~/services/cartService';
import { jwtDecode } from 'jwt-decode';

import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';
import config from '~/config';
import Image from '~/components/Image';
import Swal from 'sweetalert2'; // thư viện hiện alert 
const cx = classNames.bind(styles);
function ProductDetail() {

    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const response = await productServices.getProductById(productId);
                setProduct(response);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
            setLoading(false);
        };
        fetchProductDetails();
    }, [productId]);


    const getToken = () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) return null;
            try {
                const decoded = jwtDecode(token);
                return {
                    userId: decoded.userId,
                    userRole: decoded.userRole,
                    avatar: decoded.userAvatar || null,
                };
            } catch (error) {
                console.error('Token decode error:', error);
                return null;
            }
        };
    //lấy userId của tài khoản
    const { userId, avatar } = getToken() || {};

        //hàm xử lý thêm sản phẩm vào giỏ
    const handleAddToCart = async (id) => {

        try {
            // Kiểm tra đăng nhập
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn chưa đăng nhập',
                text: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
                confirmButtonText: 'Đăng nhập',
            }).then(() => {
                navigate('/login'); // chuyển sang trang đăng nhập
            });
            return;
            }
            // thêm sản phẩm vào giỏ
            await cartService.addCart({
              userId,
              productId,
              quantity: 1, // hoặc số lượng người dùng chọn
            });
        
              //  Bắn sự kiện giỏ hàng cập nhật
            window.dispatchEvent(new CustomEvent('cart-updated'));

            Swal.fire('Thành công', 'Sản phẩm đã được thêm vào giỏ hàng', 'success')
                // .then(() => {
                //     navigate('/');
                // });
          } catch (err) {
            Swal.fire('Lỗi', 'Không thể thêm vào giỏ hàng', 'error');
          }
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        alert(isLiked ? 'Bạn đã bỏ like sản phẩm!' : 'Bạn đã thích sản phẩm!');
    };
    const handleDeleteProduct = async () => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
        if (!confirmDelete) return;

        try {
            await productServices.deleteProductById(productId);
            alert('Sản phẩm đã được xóa thành công!');
            navigate('/');
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            alert('Đã xảy ra lỗi khi xóa sản phẩm.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    const {
        productName,
        productImgs,
        productDescription,
        productUnitPrice,
        productSupPrice,
        productQuantity,
        productSoldQuantity,
        productAvgRating,
        productCategory,
        productManufacturer,
        productOrigin,
        productUnit,
        productWarranty,
        productStatus,
    } = product;

    const hasDiscount = productSupPrice > 0;
    const productFinallyPrice = productUnitPrice * (1 - productSupPrice / 100);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('product-item')}>
                <Image className={cx('product-images')} src={productImgs[0].link} alt={productName} />

                <div className={cx('product-info')}>
                    <h2 className={cx('product-name')}>{productName}</h2>

                    <div className={cx('price')}>
                        {hasDiscount ? (
                            <>
                                <span className={cx('discount-price')}>₫{productFinallyPrice.toLocaleString()} </span>
                                <span className={cx('old-price')}>₫{productUnitPrice.toLocaleString()} </span>
                            </>
                        ) : (
                            <span className={cx('normal-price')}>{productUnitPrice.toLocaleString()} VNĐ</span>
                        )}
                    </div>
                    <div className={cx('product-quantity')}>
                        <p className={cx('description-product')}>
                            <span>Số lượng còn lại:</span> {productQuantity}
                        </p>
                        <p className={cx('description-product')}>
                            <span>Số lượng đã bán:</span> {productSoldQuantity}
                        </p>
                        <p className={cx('description-product')}>
                            <span>Đánh giá trung bình:</span> {productAvgRating}
                        </p>
                    </div>
                    <div className={cx('product-actions')}>
                        <button onClick={() => handleAddToCart(product._id)}>Thêm vào giỏ hàng</button>
                        <button onClick={handleLike} style={{ backgroundColor: isLiked ? 'red' : 'gray' }}>
                            {isLiked ? 'Bỏ thích' : 'Thích'}
                        </button>
                        <Link to={`${config.routes.updateProduct.replace(':productId', product._id)}`}>
                            <button>Sửa sản phẩm</button>
                        </Link>
                        <button onClick={handleDeleteProduct} className={cx('delete-button')}>
                            Xóa sản phẩm
                        </button>
                    </div>
                </div>
            </div>
            <div className={cx('product-details')}>
                <h3>Chi tiết sản phẩm</h3>
                <p className={cx('description-product')}>
                    <span>Danh mục:</span> {productCategory.nameCategory}
                </p>
                <p className={cx('description-product')}>
                    <span>Nhà sản xuất:</span> {productManufacturer.nameManufacturer}
                </p>
                <p className={cx('description-product')}>
                    <span>Xuất xứ:</span> {productOrigin.nameOrigin}
                </p>
                <p className={cx('description-product')}>
                    <span>Đơn vị:</span> {productUnit.nameUnit}
                </p>
                <p className={cx('description-product')}>
                    <span>Bảo hành:</span> {productWarranty} tháng
                </p>
                <p className={cx('description-product')}>
                    <span>Trạng thái:</span> {productStatus == 'available' ? 'Còn hàng' : 'Hết hàng'}
                </p>
                <p className={cx('description-product')}>
                    <span>Mô tả:</span> {productDescription}
                </p>
            </div>
        </div>
    );
}

export default ProductDetail;
