import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import styles from './Checkout.module.scss';

const cx = classNames.bind(styles);

function Checkout() {
    const location = useLocation();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [shippingFee, setShippingFee] = useState(20000);
    const [finalTotal, setFinalTotal] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const addresses = [
        '123 Đường A, Quận 1, TP.HCM',
        '456 Đường B, Quận 2, TP.HCM',
        '789 Đường C, Hà Nội',
    ];

    useEffect(() => {
        if (location.state?.cartItems) {
            setCartItems(location.state.cartItems);
            const tempTotal = location.state.cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            setTotal(tempTotal);
            setFinalTotal(tempTotal + shippingFee);
        }
    }, [location.state]);

    useEffect(() => {
        let fee = 0;
        if (shippingMethod === 'standard') fee = 20000;
        else if (shippingMethod === 'express') fee = 50000;
        setShippingFee(fee);
        setFinalTotal(total + fee);
    }, [shippingMethod, total]);

    const handleShippingChange = (e) => {
        setShippingMethod(e.target.value);
    };

    const handleAddressChange = (e) => {
        setSelectedAddress(e.target.value);
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePlaceOrder = () => {
        if (!selectedAddress) {
            alert('Vui lòng chọn địa chỉ giao hàng!');
            return;
        }

        const orderDetails = {
            items: cartItems,
            shippingMethod,
            shippingFee,
            finalTotal,
            address: selectedAddress,
            paymentMethod,
        };

        console.log('Đặt hàng:', orderDetails);
        alert('Đặt hàng thành công!');
    };

    return (
        <div className={cx('checkoutWrapper')}>
            <div className={cx('checkoutContainer')}>
                <div className={cx('checkoutLeft')}>
                    <h2>Đơn hàng của bạn</h2>
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.id} className={cx('checkoutItem')}>
                                <img
                                    src="https://via.placeholder.com/80"
                                    alt={item.name}
                                    className={cx('checkoutItemImage')}
                                />
                                <div className={cx('checkoutItemInfo')}>
                                    <span className={cx('checkoutItemName')}>{item.name}</span>
                                    <span className={cx('checkoutItemQuantity')}>
                                        Số lượng: {item.quantity}
                                    </span>
                                    <span className={cx('checkoutItemPrice')}>
                                        Giá: {(item.price * item.quantity).toLocaleString()} VND
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Không có sản phẩm nào.</p>
                    )}
                </div>

                <div className={cx('checkoutRight')}>
                    <div className={cx('checkoutSummary')}>
                        <h2>Tóm tắt đơn hàng</h2>

                        <div className={cx('summaryItem')}>
                            <span>Tạm tính:</span>
                            <span>{total.toLocaleString()} VND</span>
                        </div>

                        <div className={cx('summarySection')}>
                            <span>Chọn phương thức giao hàng:</span>
                            <select value={shippingMethod} onChange={handleShippingChange}>
                                <option value="standard">Giao hàng tiêu chuẩn (20,000 VND)</option>
                                <option value="express">Giao hàng nhanh (50,000 VND)</option>
                            </select>
                        </div>

                        <div className={cx('summarySection')}>
                            <span>Chọn địa chỉ giao hàng:</span>
                            <select value={selectedAddress} onChange={handleAddressChange}>
                                <option value="">-- Chọn địa chỉ --</option>
                                {addresses.map((address, index) => (
                                    <option key={index} value={address}>
                                        {address}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={cx('summarySection')}>
                            <span>Chọn phương thức thanh toán:</span>
                            <select value={paymentMethod} onChange={handlePaymentChange}>
                                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                                <option value="bank">Chuyển khoản ngân hàng</option>
                            </select>
                        </div>

                        <div className={cx('summaryItem')}>
                            <span>Phí vận chuyển:</span>
                            <span>{shippingFee.toLocaleString()} VND</span>
                        </div>

                        <div className={cx('summaryItemTotal')}>
                            <span>Thành tiền:</span>
                            <span>{finalTotal.toLocaleString()} VND</span>
                        </div>

                        <Button primary onClick={handlePlaceOrder}>
                            Đặt hàng
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;