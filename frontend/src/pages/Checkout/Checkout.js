import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import styles from './Checkout.module.scss';
import * as vnpayService from '~/services/vnpayService';
import * as paymentMethodService from '~/services/paymentMethodService';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const cx = classNames.bind(styles);

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [shippingFee, setShippingFee] = useState(20000);
    const [finalTotal, setFinalTotal] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState('');

    const [paymentMethod, setPaymentMethod] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    const addresses = [
        '123 Đường A, Quận 1, TP.HCM',
        '456 Đường B, Quận 2, TP.HCM',
        '789 Đường C, Hà Nội',
    ];

    useEffect(() => {
        if (location.state?.cartItems) {
            // console.log(location.state.cartItems)
            setCartItems(location.state.cartItems);
            const tempTotal = location.state.cartItems.reduce(
                (sum, item) => sum + item.unitPrice * item.quantity,
                0
            );
            setTotal(tempTotal);
            setFinalTotal(tempTotal + shippingFee);
        }

    }, [location.state]);

    useEffect(() => {
         
        const fetchMethod= async () => {
            try {
              const response = await paymentMethodService.getPaymentMethod(); 
              console.log(response)
              setPaymentMethod(response);
            } catch (error) {
              console.error('Lỗi lấy danh sách phương thức thanh toán', error);
            }
        }

        fetchMethod();

        }, []);


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
         setSelectedPaymentMethod(e.target.value);
    };

    const handlePlaceOrder = async () => {
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
            selectedPaymentMethod,
        };

        if (selectedPaymentMethod === 'vnpay') {
            try {
              const res = await vnpayService.createPaymentUrl({
                amount: finalTotal,
                items: cartItems,
                userId: 'demo-user-id',
              });
              console.log('du lieu trả về' , res)
      
              if (res?.redirectUrl) {
                window.location.href = res.redirectUrl;
              } else {
                alert('Không tạo được liên kết thanh toán.');
              }
            } catch (err) {
              console.error('Lỗi khi gọi VNPAY:', err);
              alert('Thanh toán thất bại.');
            }
          } else {
            console.log('Đặt hàng:', orderDetails);
            alert('Đặt hàng thành công!');
            // navigate('/order-success');
          }
        
    };

    return (
        <div className={cx('checkoutWrapper')}>
            <div className={cx('checkoutContainer')}>
                <div className={cx('checkoutLeft')}>
                    <h2>Đơn hàng của bạn</h2>
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item._id} className={cx('checkoutItem')}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className={cx('checkoutItemImage')}
                                />
                                <div className={cx('checkoutItemInfo')}>
                                    <span className={cx('checkoutItemName')}>{item.name}</span>
                                    <span className={cx('checkoutItemQuantity')}>
                                        Số lượng: {item.quantity}
                                    </span>
                                    <span className={cx('checkoutItemPrice')}>
                                        Giá: {(item.unitPrice * item.quantity).toLocaleString()} VND
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
                            <select value={selectedPaymentMethod} onChange={handlePaymentChange}>
                               {paymentMethod.map((method) => (
                                    <option key={method._id} value={method.paymentType}>
                                    {method.name}
                                    </option>
                                ))}
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
                        { selectedPaymentMethod === 'paypal'  && selectedAddress ?(
                            <PayPalScriptProvider options={{ 
                                "client-id": "AThBE0jR9LSLCjsKasYBzogC8WEYyqba-Nkv0esjVjtt9lEPTi-lGfQwdnFol6uaD14djldcjtkDVLi-",
                                 currency: "USD",
                                 intent: "capture",
                                 components: "buttons",
                                 "enable-funding": "paypal",
                                 "data-sdk-integration-source": "button-factory"
                                 }}>
                               <PayPalButtons
                                style={{ layout: "vertical" }}
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                    purchase_units: [
                                        {
                                        amount: {
                                            // value: finalTotal.toString(), // tổng tiền đơn hàng
                                            value: "0.01"
                                        },
                                        },
                                    ],
                                    });
                                }}
                                onApprove={(data, actions) => {
                                    return actions.order.capture().then((details) => {
                                    alert("Thanh toán thành công bởi " + details.payer.name.given_name);
                                    console.log(details, data);
                                    // Gọi server lưu đơn hàng nếu muốn
                                    // navigate("/payment-success");
                                    });
                                }}
                                onError={(err) => {
                                    console.error("❌ Lỗi khi thanh toán PayPal:", err);
                                    alert("Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.");
                                  }}
                                />
                            </PayPalScriptProvider>
                        ):(
                        <Button primary onClick={handlePlaceOrder}>
                            Đặt hàng
                        </Button>
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;