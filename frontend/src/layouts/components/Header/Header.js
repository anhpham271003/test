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
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

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


const cx = classNames.bind(styles);

function Header() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const getCategoryIdByName = (name) => {
        const category = categories.find((cat) => cat.nameCategory.trim() === name);
        return category?._id;
    };
    const laptopId = categories.length > 0 ? getCategoryIdByName('Laptop') : null;

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
    const MENU_ITEMS = [
        {
            icon: <FontAwesomeIcon icon={faLaptop} />,
            title: 'Laptop',
            to: `/category/${laptopId}`,
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
            icon: <FontAwesomeIcon icon={faImage} />,
            title: 'Banner',
            to: '/new',
        },
        {
            icon: <FontAwesomeIcon icon={faSignOutAlt} />, // thêm icon logout
            title: 'Đăng xuất',
            separate: true, // nếu muốn có vạch ngăn cách
            onClick: handleLogout, // gọi hàm logout
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
                                <Image
                                    className={cx('user-avatar')}
                                    src="https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/345436276_621172086598490_967795278169891486_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF911cFQ6AhlrpQyyGpdwVpttJhKcBjCVC20mEpwGMJUFROXBFnCdYar10Do2pC8AssXZ9ceLvKEiRWyp7D9w1H&_nc_ohc=oizIRI8DkfcQ7kNvgGGX_BB&_nc_oc=AdmwkAZ6sLjC0AraaLY9ttj9zoCNh-2UwfK8A4RFQycJpGtrydfim_Qcp-BsEcjkx_U&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&_nc_gid=bYnb35aY-cePk6FB0YnO2Q&oh=00_AYEp5s2iglYeMUqrUhKoZ5Pcapnshi9UwtB5XioR0lGsRg&oe=67F425B8"
                                    alt="Nguyen Van A"
                                />
                            ) : (
                                <></>
                            )}
                        </Menu>
                        <Tippy delay={[0, 50]} content="Giỏ hàng" placement="bottom">
                            <button className={cx('action-btn')}>
                                <CartIcons />
                            </button>
                        </Tippy>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;
