import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { jwtDecode } from 'jwt-decode';

import Button from '~/components/Button';
import styles from './Checkout.module.scss';
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as vnpayService from '~/services/vnpayService';
import * as paymentMethodService from '~/services/paymentMethodService';
import * as checkoutService from '~/services/checkoutService';

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
        
        const { userId, avatar } = getToken() || {};


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

              const res = await vnpayService.createPaymentUrl(
                
                // amount: finalTotal,
                // items: cartItems,
                // userId: 'demo-user-id',
              {
                    userId: 'demo-user-id',
                    orderItems: cartItems.map(item => ({
                        productId: item._id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.unitPrice
                    })),
                    shippingAddress: selectedAddress,
                    paymentMethod: selectedPaymentMethod,
                    shippingPrice: shippingFee,
                    totalPrice: finalTotal,
                    isPaid: true,
                    paidAt: new Date(),
                    orderStatus: "processing"
                }
            );
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
          } 

        //   if (selectedPaymentMethod === 'paypal') {
        //     try {
        //       const res = await checkoutService.createOrder({
        //             userId: 'demo-user-id',
        //             orderItems: cartItems.map(item => ({
        //                 productId: item._id,
        //                 name: item.name,
        //                 quantity: item.quantity,
        //                 price: item.unitPrice
        //             })),
        //             shippingAddress: selectedAddress,
        //             paymentMethod: selectedPaymentMethod,
        //             shippingPrice: shippingFee,
        //             totalPrice: finalTotal,
        //             isPaid: true,
        //             paidAt: new Date(),
        //             orderStatus: "processing"
        //         }
        //     );
            
        //       console.log('du lieu trả về' , res)
        //     //   alert("Đặt hàng thành công!");
        //     // 
        //     } catch (err) {
        //       console.error('Lỗi khi gọi PAYPAl:', err);
        //       alert('Thanh toán thất bại.');
        //     }
        //   }
    };

    return (
        <div className={cx('checkoutWrapper')}>
             <ToastContainer 
                    position="top-center"  //  Đặt ở góc dưới bên trái
                    autoClose={3000}         // Tự động tắt sau 3 giây (có thể chỉnh)
                    hideProgressBar={true}  //  thanh tiến trình
                    newestOnTop={false}    //Toast mới sẽ hiện dưới các toast cũ.
                    closeOnClick            //Cho phép đóng toast
                    draggable
                />
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
                                            value: "1"
                                        },
                                        },
                                    ],
                                    });
                                }}
                                onApprove={(data, actions) => {
                                    return actions.order.capture()
                                        .then(async (details) => {
                                            window.close();
                                            console.log(details, data);
                                            const res = await checkoutService.createOrder({
                                                // userId: 'demo-user-id',
                                                // items: cartItems,
                                                // address: selectedAddress,
                                                // shippingMethod,
                                                // shippingFee,
                                                // finalTotal,
                                                // selectedPaymentMethod,
                                                userId: userId,
                                                orderItems: cartItems.map(item => ({
                                                    cartId: item._id,
                                                    productId : item.product,
                                                    name: item.name,
                                                    quantity: item.quantity,
                                                    price: item.unitPrice,
                                                    productImage: item.image,
                                                })),
                                                shippingAddress: selectedAddress,
                                                paymentMethod: selectedPaymentMethod,
                                                shippingPrice: shippingFee,
                                                totalPrice: finalTotal,
                                                isPaid: true,
                                                paidAt: new Date(),
                                                orderStatus: "pending"
                                            });
                                            console.log('du lieu trả về' , res)
                                            console.log(data, actions)
                                            // Gọi server lưu đơn hàng nếu muốn
                                            window.dispatchEvent(new Event("cart-updated"));
                                            navigate("/" , {
                                                state: {
                                                  toastMessage: "Thanh toán thành công bởi " + details.payer.name.given_name
                                                }
                                              });
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