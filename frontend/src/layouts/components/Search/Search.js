import React, { useState, useEffect, useRef } from 'react';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import * as searchServices from '~/services/searchService';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { SearchIcon } from '~/components/Icons';
import { useDebounce } from '~/hooks';
import styles from './Search.module.scss';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);

    const debouncedValue = useDebounce(searchValue, 500);

    const inputRef = useRef();

    useEffect(() => {
        if (!debouncedValue) {
            setSearchResult([]);
            return;
        }
        const fetchAPI = async () => {
            setLoading(true);
            const result = await searchServices.search(debouncedValue);
            console.log('Search Result:', result); // Kiểm tra API trả về
            setSearchResult(result.products);
            setLoading(false);
        };
        fetchAPI();
    }, [debouncedValue]);
    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };
    const handleHideResult = () => {
        setShowResult(false);
    };
    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    return (
        <div>
            <HeadlessTippy
                interactive
                visible={showResult && searchResult.length > 0}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search-title')}>Product</h4>
                            {/* Hiển thị chỉ 5 sản phẩm đầu tiên */}
                            {searchResult.slice(0, 7).map((result) => {
                                const hasDiscount = result.productSupPrice > 0; // Kiểm tra có giảm giá không
                                const productFinallyPrice =
                                    result.productUnitPrice * (1 - result.productSupPrice / 100);
                                return (
                                    <div key={result._id} className={cx('product-item')}>
                                        <img
                                            className={cx('product-avatar')}
                                            src={result.productImgs[0].link}
                                            alt={result.productName}
                                        />
                                        <div className={cx('product-info')}>
                                            <h3>{result.productName}</h3>

                                            {/* Hiển thị giá */}
                                            <p>
                                                {hasDiscount ? (
                                                    <>
                                                        <span className={cx('old-price')}>
                                                            {result.productUnitPrice.toLocaleString()} VNĐ
                                                        </span>{' '}
                                                        <span className={cx('discount-price')}>
                                                            {productFinallyPrice.toLocaleString()} VNĐ
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className={cx('normal-price')}>
                                                        {result.productUnitPrice.toLocaleString()} VNĐ
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </PopperWrapper>
                    </div>
                )}
                onClickOutside={handleHideResult}
            >
                <div className={cx('search')}>
                    <input
                        ref={inputRef}
                        value={searchValue}
                        placeholder="Search products...."
                        spellCheck={false}
                        onChange={handleChange}
                        onFocus={() => setShowResult(true)}
                    />
                    {!!searchValue && !loading && (
                        <button className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}
                    {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
                    <button className={cx('search-btn')} onMouseDown={(e) => e.preventDefault()}>
                        <SearchIcon />
                    </button>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Search;
