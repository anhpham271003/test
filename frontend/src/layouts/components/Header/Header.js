
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
import { Link } from 'react-router-dom';
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
import { useEffect, useState } from 'react';

// cart
import Drawer from '@mui/material/Drawer';
import { IoCloseSharp } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import * as cartService from '~/services/cartService';
//cart
const cx = classNames.bind(styles);

function Header() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categoryMap, setCategoryMap] = useState({});

    //cart
    const [cartItems, setCartItems] = useState([]);  
    const [openCartPanel, setOpenCartPanel] = useState(false);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    //cart

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
    // console.log('userId:', userId);
    // console.log('avatarUser:', avatar);

    const currentUser = !!userId;
    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.reload();
    };

    
    //cart
    
    const fetchCart = async () => {
        if (!userId) return;
        try {
            const data = await cartService.getCart();
            console.log("Dữ liệu cart từ server:", data);

            setCartItems(data.cart);
            setTotalQuantity(data.totalQuantity || 0);
            setTotalPrice(data.totalPrice || 0);
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
                item._id === id ? { ...item, selected: !item.selected } : item
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
            (total, item) => {
                const price = Number(item.unitPrice);
                const qty = Number(item.quantity);
                return item.selected ? total + price * qty : total;
            }, 0);
    };

    const handleCheckout = () => {
        const selectedItems = cartItems.filter(item => item.selected);
        setOpenCartPanel(false);
        // navigate('/checkout', { state: { cartItems: selectedItems } });
    };
    //cart

    const MENU_ITEMS = [
        {
            icon: <FontAwesomeIcon icon={faLaptop} />,
            title: 'Laptop',
            to: `/category/${categoryMap['Laptop'] || ''}`,
        },
        {
            icon: <FontAwesomeIcon icon={faMobilePhone} />,
            title: 'Điện thoại',
            to: `/category/${categoryMap['Điện thoại'] || ''}`,
        },
        {
            icon: <FontAwesomeIcon icon={faDesktop} />,
            title: 'PC',
            to: `/category/${categoryMap['PC'] || ''}`,
        },
        {
            icon: <ComponentElectronicIcon />,
            title: 'Electronic devices',
            to: `/category/${categoryMap['Electronic devices'] || ''}`,
        },
        {
            icon: <FontAwesomeIcon icon={faKeyboard} />,
            title: 'Keyboards',
            to: `/category/${categoryMap['Keyboards'] || ''}`,
        },
        {
            icon: <FontAwesomeIcon icon={faHeadphones} />,
            title: 'Headphones',
            to: `/category/${categoryMap['Headphones'] || ''}`,
        },
    ];

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'Thông tin cá nhân',
            to: `/profile/${userId}`,
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
            icon: <FontAwesomeIcon icon={faSignOutAlt} />, // thêm icon logout
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
                                        {/* <span className={cx('badge')}>12</span> */}
                                    </button>
                                </Tippy>
                            </>
                        ) : (
                            <>
                                <Button primary to="/login">
                                    Log in
                                </Button>
                            </>
                        )}

                        <Menu items={currentUser ? userMenu : MENU_ITEMS}>
                            {currentUser ? (
                                <Image className={cx('user-avatar')} src={avatar} alt="Avatar User" />
                            ) : (
                                <></>
                            )}
                        </Menu>
                        <Tippy delay={[0, 50]} content="Giỏ hàng" placement="bottom">
                            <button className={cx('action-btn')} onClick ={() => setOpenCartPanel(true)}>
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
                            <div key={item._id} className={cx('cartItem')}>
                                <input
                                    type="checkbox"
                                    checked={item.selected}
                                    onChange={() => handleToggleSelect(item._id)}
                                    className={cx('cartItemCheckbox')}
                                />
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className={cx('cartItemImage')}
                                />
                                <div className={cx('cartItemInfo')}>
                                    <span className={cx('cartItemName')}>{item.name}</span>
                                    <div className={cx('cartItemDetails')}>
                                        <div className={cx('quantityControl')}>
                                            <button onClick={() => handleDecrease(item._id)}>-</button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                                className={cx('quantityInput')}
                                            />
                                            <button onClick={() => handleIncrease(item._id)}>+</button>
                                        </div>
                                        <span>Đơn giá: {totalPrice.toLocaleString()} VND</span>
                                    </div>
                                </div>
                                <RiDeleteBin5Fill
                                    className={cx('cartItemDelete')}
                                    onClick={() => handleDeleteItem(item._id)}
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
                        <Link to ="/cartDetail" className="checkout-btn">  
                                <Button className={cx('checkout-btn')} primary onClick={handleCheckout}>
                                    Xem chi tiết
                                </Button>
                        </Link>
                        <Link to ="/checkout" className="checkout-btn">  
                                <Button className={cx('checkout-btn')} primary onClick={handleCheckout}>
                                    Thanh toán
                                </Button>
                        </Link>
                        
                    </div>
                </div>
            </Drawer>

        </header>
    );
}

export default Header;


