import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '~/services/cartService';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faKeyboard,
    faUser,
    faLaptop,
    faDesktop,
    faHeadphones,
    faBoxes,
    faLocationDot,
    faPlus,
    faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import Drawer from '@mui/material/Drawer';
import { IoCloseSharp } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";

import config from '~/config';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Menu from '~/components/Popper/Menu';
import { InboxIcon, CartIcons, BarsIcon, ComponentElectronicIcon } from '~/components/Icons';
import Image from '~/components/Image';
import Search from '../Search';
import * as categoryService from '~/services/categoryService';

const cx = classNames.bind(styles);

function Header() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [openCartPanel, setOpenCartPanel] = useState(false);

    const getCategoryIdByName = (name) => {
        const category = categories.find((cat) => cat.nameCategory.trim() === name);
        return category?._id;
    };
    const laptopId = categories.length > 0 ? getCategoryIdByName('Laptop') : null;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryData = await categoryService.getCategories();
                setCategories(categoryData);
                setLoading(true);
            } catch (error) {
                setError('Không thể tải danh mục. Vui lòng thử lại.');
                setLoading(true);
            }
        };
        fetchCategories();
    }, [laptopId]);

    const getToken = () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        return token;
    };
    const currentUser = getToken() ? true : false;
    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.reload();
    };

    const fetchCart = async () => {
        const userId = getToken(); // Assuming token is user identifier
        try {
            const data = await cartService.getCart(userId);
            setCartItems(data);
        } catch (error) {
            console.error('Lỗi lấy cart:', error);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchCart();
        }
    }, [currentUser]);

    const handleToggleSelect = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const handleDeleteItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const handleQuantityChange = (id, value) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, Number(value)) }
                    : item
            )
        );
    };

    const handleIncrease = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const handleDecrease = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                    : item
            )
        );
    };

    const calculateTotal = () => {
        return cartItems.reduce(
            (total, item) =>
                item.selected ? total + item.price * item.quantity : total,
            0
        );
    };

    const handleCheckout = () => {
        const selectedItems = cartItems.filter(item => item.selected);
        navigate('/checkout', { state: { cartItems: selectedItems } });
    };

    const MENU_ITEMS = [
        {
            icon: <FontAwesomeIcon icon={faLaptop} />,
            title: 'Laptop',
            to: /category/${laptopId},
        },
        {
            icon: <FontAwesomeIcon icon={faDesktop} height="16" width="20" />,
            title: 'PC',
            to: '/pc',
        },
        {
            icon: <ComponentElectronicIcon height="16" width="20" />,
            title: 'Electronic devices',
            to: '/electronic-devices',
        },
        {
            icon: <FontAwesomeIcon icon={faKeyboard} height="16" width="20" />,
            title: 'Keyboards',
            to: '/keyboards',
        },
        {
            icon: <FontAwesomeIcon icon={faHeadphones} height="16" width="20" />,
            title: 'Headphones',
            to: '/headphones',
        },
    ];

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'Thông tin cá nhân',
            to: '/user',
        },
        {
            icon: <FontAwesomeIcon icon={faBoxes} />,
            title: 'Đơn hàng của tôi',
            to: '/order',
        },
        {
            icon: <FontAwesomeIcon icon={faLocationDot} />,
            title: 'Sổ địa chỉ',
            to: '/address',
        },
        {
            icon: <FontAwesomeIcon icon={faPlus} />,
            title: 'Thêm sản phẩm',
            to: '/addProduct',
        },
        {
            icon: <FontAwesomeIcon icon={faSignOutAlt} />,
            title: 'Đăng xuất',
            separate: true,
            onClick: handleLogout,
        },
    ];

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={config.routes.home} className={cx('logo-link')}>
                    <img src={images.logo} alt="Logo" />
                </Link>
                <Menu items={MENU_ITEMS}>
                    <button className={cx('action-btn')}>
                        <BarsIcon />
                    </button>
                </Menu>
                <Search />
                <div className={cx('actions')}>
                    {currentUser ? (
                        <>
                            <Tippy delay={[0, 50]} content="Thông báo" placement="bottom">
                                <button className={cx('action-btn')}>
                                    <InboxIcon />
                                </button>
                            </Tippy>
                        </>
                    ) : (
                        <Button primary to="/login">
                            Log in
                        </Button>
                    )}
                    <Menu items={currentUser ? userMenu : MENU_ITEMS}>
                        {currentUser ? (
                            <Image
                                className={cx('user-avatar')}
                                src="https://via.placeholder.com/50"
                                alt="Nguyen Van A"
                            />
                        ) : (
                            <></>
                        )}
                    </Menu>
                    <Tippy delay={[0, 50]} content="Giỏ hàng" placement="bottom">
                        <button className={cx('action-btn')} onClick={() => setOpenCartPanel(true)}>
                            <CartIcons />
                        </button>
                    </Tippy>
                </div>
            </div>

            {/* Cart Panel */}
            <Drawer open={openCartPanel} onClose={() => setOpenCartPanel(false)} anchor="right">
                <div className={cx('cartDrawer')}>
                    <div className={cx('cartHeader')}>
                        <h1 className={cx('cartTitle')}>Giỏ hàng</h1>
                        <IoCloseSharp
                            className={cx('cartClose')}
                            onClick={() => setOpenCartPanel(false)}
                        />
                    </div>
                    <div className={cx('cartItems')}>
                        {cartItems.map((item) => (
                            <div key={item.id} className={cx('cartItem')}>
                                <input
                                    type="checkbox"
                                    checked={item.selected}
                                    onChange={() => handleToggleSelect(item.id)}
                                    className={cx('cartItemCheckbox')}
                                />
                                <img
                                    src="https://via.placeholder.com/50"
                                    alt={item.name}
                                    className={cx('cartItemImage')}
                                />
                                <div className={cx('cartItemInfo')}>
                                    <span className={cx('cartItemName')}>{item.name}</span>
                                    <div className={cx('cartItemDetails')}>
                                        <div className={cx('quantityControl')}>
                                            <button onClick={() => handleDecrease(item.id)}>-</button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                className={cx('quantityInput')}
                                            />
                                            <button onClick={() => handleIncrease(item.id)}>+</button>
                                        </div>
                                        <span>Đơn giá: {item.price.toLocaleString()} VND</span>
                                    </div>
                                </div>
                                <RiDeleteBin5Fill
                                    className={cx('cartItemDelete')}
                                    onClick={() => handleDeleteItem(item.id)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className={cx('cartFooter')}>
                        <div className={cx('cartTotal')}>
                            <span className={cx('totalLabel')}>Tạm tính: </span>
                            <span className={cx('totalValue')}>
                                {calculateTotal().toLocaleString()} VND
                            </span>
                        </div>
                        <Button primary onClick={handleCheckout}>
                            Thanh toán
                        </Button>
                    </div>
                </div>
            </Drawer>
        </header>
    );
}

export default Header;


import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faKeyboard,
    faUser,
    faLaptop,
    faDesktop,
    faHeadphones,
    faBoxes,
    faLocationDot,
    faPlus,
    faSignOutAlt,
    faImage,
    faMobilePhone,
    faStar,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { jwtDecode } from 'jwt-decode';
import config from '~/config';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Menu from '~/components/Popper/Menu';
import { InboxIcon, CartIcons, BarsIcon, ComponentElectronicIcon } from '~/components/Icons';
import Image from '~/components/Image';
import Search from '../Search';
import * as categoryService from '~/services/categoryService';
import cartService from '~/services/cartService';
import { useEffect, useState } from 'react';

import Drawer from '@mui/material/Drawer';
import { IoCloseSharp } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";

const cx = classNames.bind(styles);

function Header() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categoryMap, setCategoryMap] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [openCartPanel, setOpenCartPanel] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryData = await categoryService.getCategories();
                const map = {};
                categoryData.forEach((cat) => {
                    map[cat.nameCategory.trim()] = cat._id;
                });
                setCategoryMap(map);
                setLoading(true);
            } catch (error) {
                setError('Không thể tải danh mục. Vui lòng thử lại.');
                setLoading(true);
            }
        };
        fetchCategories();
    }, []);

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
    const currentUser = !!userId;

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.reload();
    };

    const fetchCart = async () => {
        if (!userId) return;
        try {
            const data = await cartService.getCart(userId);
            setCartItems(data);
        } catch (error) {
            console.error('Lỗi lấy cart:', error);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchCart();
        }
    }, [currentUser]);

    const handleToggleSelect = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const handleDeleteItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const handleQuantityChange = (id, value) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, Number(value)) }
                    : item
            )
        );
    };

    const handleIncrease = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const handleDecrease = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                    : item
            )
        );
    };

    const calculateTotal = () => {
        return cartItems.reduce(
            (total, item) =>
                item.selected ? total + item.price * item.quantity : total,
            0
        );
    };

    const handleCheckout = () => {
        const selectedItems = cartItems.filter(item => item.selected);
        navigate('/checkout', { state: { cartItems: selectedItems } });
    };

    const MENU_ITEMS = [
        {
            icon: <FontAwesomeIcon icon={faLaptop} />,
            title: 'Laptop',
            to: /category/${categoryMap['Laptop'] || ''},
        },
        {
            icon: <FontAwesomeIcon icon={faMobilePhone} />,
            title: 'Điện thoại',
            to: /category/${categoryMap['Điện thoại'] || ''},
        },
        {
            icon: <FontAwesomeIcon icon={faDesktop} />,
            title: 'PC',
            to: /category/${categoryMap['PC'] || ''},
        },
        {
            icon: <ComponentElectronicIcon />,
            title: 'Electronic devices',
            to: /category/${categoryMap['Electronic devices'] || ''},
        },
        {
            icon: <FontAwesomeIcon icon={faKeyboard} />,
            title: 'Keyboards',
            to: /category/${categoryMap['Keyboards'] || ''},
        },
        {
            icon: <FontAwesomeIcon icon={faHeadphones} />,
            title: 'Headphones',
            to: /category/${categoryMap['Headphones'] || ''},
        },
    ];

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'Thông tin cá nhân',
            to: /profile/${userId},
        },
        {
            icon: <FontAwesomeIcon icon={faBoxes} />,
            title: 'Đơn hàng của tôi',
            to: '/order',
        },
        {
            icon: <FontAwesomeIcon icon={faLocationDot} />,
            title: 'Sổ địa chỉ',
            to: '/address',
        },
        {
            icon: <FontAwesomeIcon icon={faPlus} />,
            title: 'Thêm sản phẩm',
            to: '/addProduct',
        },
        {
            icon: <FontAwesomeIcon icon={faImage} />,
            title: 'Banner',
            to: '/news',
        },
        {
            icon: <FontAwesomeIcon icon={faStar} />,
            title: 'Khuyến mãi',
            to: '/sales',
        },
        {
            icon: <FontAwesomeIcon icon={faSignOutAlt} />,
            title: 'Đăng xuất',
            separate: true,
            onClick: handleLogout,
        },
    ];

    return (
        <header className={cx('wrapper')}>
            {!error && !loading ? (
                <div className={cx('loading')}>Loading...</div>
            ) : (
                <div className={cx('inner')}>
                    <Link to={config.routes.home} className={cx('logo-link')}>
                        <img src={images.logo} alt="Logo" />
                    </Link>
                    <Menu items={MENU_ITEMS}>
                        <button className={cx('action-btn')}>
                            <BarsIcon />
                        </button>
                    </Menu>
                    <Search />
                    <div className={cx('actions')}>
                        {currentUser ? (
                            <>
                                <Tippy delay={[0, 50]} content="Thông báo" placement="bottom">
                                    <button className={cx('action-btn')}>
                                        <InboxIcon />
                                    </button>
                                </Tippy>
                            </>
                        ) : (
                            <Button primary to="/login">
                                Log in
                            </Button>
                        )}
                        <Menu items={currentUser ? userMenu : MENU_ITEMS}>
                            {currentUser ? (
                                <Image className={cx('user-avatar')} src={avatar} alt="Avatar User" />
                            ) : (
                                <></>
                            )}
                        </Menu>
                        <Tippy delay={[0, 50]} content="Giỏ hàng" placement="bottom">
                            <button className={cx('action-btn')} onClick={() => setOpenCartPanel(true)}>
                                <CartIcons />
                            </button>
                        </Tippy>
                    </div>
                </div>
            )}

            {/* Cart Panel */}
            <Drawer open={openCartPanel} onClose={() => setOpenCartPanel(false)} anchor="right">
                <div className={cx('cartDrawer')}>
                    <div className={cx('cartHeader')}>
                        <h1 className={cx('cartTitle')}>Giỏ hàng</h1>
                        <IoCloseSharp
                            className={cx('cartClose')}
                            onClick={() => setOpenCartPanel(false)}
                        />
                    </div>
                    <div className={cx('cartItems')}>
                        {cartItems.map((item) => (
                            <div key={item.id} className={cx('cartItem')}>
                                <input
                                    type="checkbox"
                                    checked={item.selected}
                                    onChange={() => handleToggleSelect(item.id)}
                                    className={cx('cartItemCheckbox')}
                                />
                                <img
                                    src="https://via.placeholder.com/50"
                                    alt={item.name}
                                    className={cx('cartItemImage')}
                                />
                                <div className={cx('cartItemInfo')}>
                                    <span className={cx('cartItemName')}>{item.name}</span>
                                    <div className={cx('cartItemDetails')}>
                                        <div className={cx('quantityControl')}>
                                            <button onClick={() => handleDecrease(item.id)}>-</button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                className={cx('quantityInput')}
                                            />
                                            <button onClick={() => handleIncrease(item.id)}>+</button>
                                        </div>
                                        <span>Đơn giá: {item.price.toLocaleString()} VND</span>
                                    </div>
                                </div>
                                <RiDeleteBin5Fill
                                    className={cx('cartItemDelete')}
                                    onClick={() => handleDeleteItem(item.id)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className={cx('cartFooter')}>
                        <div className={cx('cartTotal')}>
                            <span className={cx('totalLabel')}>Tạm tính: </span>
                            <span className={cx('totalValue')}>
                                {calculateTotal().toLocaleString()} VND
                            </span>
                        </div>
                        <Button primary onClick={handleCheckout}>
                            Thanh toán
                        </Button>
                    </div>
                </div>
            </Drawer>
        </header>
    );
}

export default Header;





// // Add product to cart
// router.post("/add", async (req, res) => {
//   try {
//     const { userId, productId, quantity } = req.body;
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     const unitPrice = product.productSupPrice || product.productUnitPrice;
//     const cartItem = user.cart.find(
//       (item) => item.product.toString() === productId
//     );

//     if (cartItem) {
//       cartItem.quantity += quantity;
//     } else {
//       user.cart.push({ product: productId, quantity, unitPrice });
//     }

//     await user.save();
//     res.json({ message: "Added to cart successfully", cart: user.cart });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update product quantity in cart
// router.post("/update", async (req, res) => {
//   try {
//     const { userId, productId, quantity } = req.body;
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const cartItem = user.cart.find(
//       (item) => item.product.toString() === productId
//     );
//     if (!cartItem)
//       return res.status(404).json({ message: "Product not found in cart" });

//     if (quantity <= 0) {
//       user.cart = user.cart.filter(
//         (item) => item.product.toString() !== productId
//       );
//     } else {
//       const product = await Product.findById(productId);
//       cartItem.quantity = quantity;
//       cartItem.unitPrice = product.productSupPrice || product.productUnitPrice;
//     }

//     await user.save();
//     res.json({ message: "Cart updated successfully", cart: user.cart });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Remove product from cart
// router.post("/remove", async (req, res) => {
//   try {
//     const { userId, productId } = req.body;
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.cart = user.cart.filter(
//       (item) => item.product.toString() !== productId
//     );
//     await user.save();
//     res.json({ message: "Removed from cart successfully", cart: user.cart });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Checkout: Convert cart to order
// router.post("/checkout", async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const user = await User.findById(userId).populate("cart.product");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     if (user.cart.length === 0)
//       return res.status(400).json({ message: "Cart is empty" });
//     const orderDetails = user.cart.map((item) => ({
//       product: item.product._id,
//       quantity: item.quantity,
//       unitPrice: item.product.productSupPrice || item.product.productUnitPrice,
//       totalPrice:
//         item.quantity *
//         (item.product.productSupPrice || item.product.productUnitPrice),
//     }));
//     const totalAmount = orderDetails.reduce(
//       (acc, item) => acc + item.totalPrice,
//       0
//     );
//     const newOrder = new Order({
//       user: userId,
//       orderDetails,
//       totalAmount,
//       orderStatus: "pending",
//     });
//     await newOrder.save();
//     // Clear cart after order
//     user.cart = [];
//     await user.save();

//     res.json({
//       message: "Order placed successfully",
//       orderId: newOrder._id,
//       orderDetails: newOrder.orderDetails,
//       totalAmount: newOrder.totalAmount,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


    // if (paymentMethod === 'vnpay') {
    //     try {
    //       const res = await vnpayService.createPaymentUrl({
    //         amount: finalTotal,
    //         items: cartItems,
    //         userId: 'demo-user-id',
    //       });
  
    //       if (res?.redirectUrl) {
    //         window.location.href = res.redirectUrl;
    //       } else {
    //         alert('Không tạo được liên kết thanh toán.');
    //       }
    //     } catch (err) {
    //       console.error('Lỗi khi gọi VNPAY:', err);
    //       alert('Thanh toán thất bại.');
    //     }
    //   } else {
    //     console.log('Đặt hàng:', orderDetails);
    //     alert('Đặt hàng thành công!');
    //     navigate('/order-success');
    //   }