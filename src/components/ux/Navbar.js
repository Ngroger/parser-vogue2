import React, { Component } from 'react';
import { CiSearch } from "react-icons/ci";
import { BsFilterRight } from "react-icons/bs";
import { LuShoppingCart, LuBell } from "react-icons/lu";
import CartMenu from '../ui/menu/CartMenu';
import Filters from '../ui/menu/Filters';
import Notification from '../ui/menu/Notification';
import { Link } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

class Navbar extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            isFilterOpen: false,
            isCartOpen: false,
            isNotificationOpen: false,
            fullname: '',
            surname: '',
            cartCount: 0,
            nameOfPage: '',
            isOpenWarningNotification: false,
            isOpenWarningCart: false
        };
    }

    toggleOpenFilter = () => {
        console.log('filter opened');
        console.log(this.state)
        this.setState((prevState) => ({ isFilterOpen: !prevState.isFilterOpen }));
    };
    
    toggleOpenCart = () => {
        const authTokenCookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
        if(authTokenCookie) {
            this.setState((prevState) => ({ isCartOpen: !prevState.isCartOpen }));
            this.setState({ isOpenWarningCart: false });
        } else {
            this.setState({ isOpenWarningCart: true });
        }
    }
    
    toggleOpenNotification = () => {
        this.setState((prevState) => ({ isNotificationOpen: !prevState.isNotificationOpen }));
    }

    selectPage = (name) => {

    }

    componentDidMount() {
        // Checking if there's a cookie
        const authTokenCookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
        const url = new URL(window.location.href);
        const currentPage = url.pathname.split('/').pop();

        this.setState({ nameOfPage: currentPage });
        console.log(currentPage);
        // If there's a cookie, proceed to extract authToken
        if (authTokenCookie) {
            const authToken = authTokenCookie.split('=')[1];    
            // Function to fetch user data
            const fetchUserData = () => {
                fetch('http://45.12.72.22:5050/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: `${authToken}` }),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        this.setState({ fullname: data.user.fullname, surname: data.user.surname });
                    })
                    .catch(error => {
                        console.error('Ошибка при получении данных с сервера: ', error);
                    });
            };
    
            // Fetch user data
            fetchUserData();
    
            // Function to fetch cart count
            const fetchCartCount = () => {
                fetch('http://45.12.72.22:5050/getCartCount', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: `${authToken}` }),
                })
                    .then(response => response.json())
                    .then(data => {
                        this.setState({ cartCount: data.cartCount });
                    })
                    .catch(error => {
                        console.error('Ошибка при получении данных с сервера: ', error);
                    });
            };
    
            // Fetch cart count initially
            fetchCartCount();
    
            // Set up interval for fetching cart count
            this.cartCountInterval = setInterval(() => {
                fetchCartCount();
            }, 5000);
        } else {
            // Handle the case when there's no authToken (cookie) available
            console.error('No authToken found in the cookie.');
            // You might want to handle this case by redirecting to the login page or taking appropriate action.
        }
    }
    
    componentWillUnmount() {
        // Очищаем интервал перед размонтированием компонента
        clearInterval(this.cartCountInterval);
    }
    
    fetchUserData() {
        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken=')).split('=')[1];

        fetch('http://45.12.72.22:5050/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: `${authToken}` }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({ fullname: data.user.fullname, surname: data.user.surname });
        })
        .catch(error => {
            console.error('Ошибка при получении данных с сервера: ', error);
        });
    }

    render() {
        return (    
            <div className='p-6 w-screen border-1 border-black flex flex-row items-center justify-between px-10'>
                <p className='text-[#255957] text-4xl font-bold'>ParserVogue</p>
                <div className='space-x-6 flex'>
                    <Link onClick={async() => this.selectPage('main')} to='/main'>
                        <p className={ this.state.nameOfPage === 'main' ? 'text-[#255957] text-2xl font-light border-b-[1px] border-[#255957] py-1 hover:opacity-25' : 'text-[#255957] text-2xl font-light opacity-50 hover:opacity-25 py-1' }>Главная</p>
                    </Link>
                    {/* <Link onClick={async () => this.selectPage('categories')} to='/categories'>
                        <p className={ this.state.nameOfPage === 'categories' ? 'text-[#255957] text-2xl font-light border-b-[1px] border-[#255957] py-1 hover:opacity-25' : 'text-[#255957] text-2xl font-light opacity-50 hover:opacity-25 py-1' }>Категории</p>
                    </Link> */}
                    <Link onClick={async () => this.selectPage('parser')} to='/parser'>
                        <p className={ this.state.nameOfPage === 'parser' ? 'text-[#255957] text-2xl font-light border-b-[1px] border-[#255957] py-1 hover:opacity-25' : 'text-[#255957] text-2xl font-light opacity-50 hover:opacity-25 py-1' }>Парсер</p>
                    </Link>
                    <div className='p-2 border-2 border-[#255957] rounded-xl flex space-x-2 px-6'>
                        <CiSearch color='#255957' size={32}/>
                        <input className='bg-transparent outline-none text-xl text-[#255957] w-32' placeholder='Поиск...'/>
                        <BsFilterRight onClick={this.toggleOpenFilter} color='#255957' size={32}/>
                    </div>
                </div>
                <div className='flex flex-row items-center space-x-4'>
                    { this.state.fullname === '' || this.state.surname ? (
                        <div className='flex flex-row space-x-6'>
                            <Link to='/reg' className='p-2 border-2 px-6 group hover:bg-[#255957] rounded-lg border-[#255957]'>
                                <p className='text-lg font-medium group-hover:text-[#fff] text-[#255957]'>Регистрация</p>
                            </Link>
                            <Link to='/reg' className='p-2 border-2 group hover:bg-white px-6 rounded-lg border-[#FFF]'>
                                <p className='text-lg group-hover:text-[#255957] font-medium text-white'>Войти</p>
                            </Link>
                        </div>
                    ) : (
                        <p className='text-[#255957] text-2xl font-medium'>{this.state.fullname} {this.state.surname}</p>
                    ) }
                    <div className='relative flex'>
                        { this.state.cartCount !== 0 && (
                            <div className='w-6 h-6 absolute z-20 rounded-full bg-[#255957] left-8 justify-center items-center flex'>
                                <p className='text-white font-bold text-sm'>{this.state.cartCount}</p>
                            </div>
                        ) }
                        <LuShoppingCart onClick={this.toggleOpenCart} className='hover:opacity-50 z-10' color='#255957' size={46}/>
                    </div>
                    <LuBell onClick={this.toggleOpenNotification} className='hover:opacity-50' color='#255957' size={46}/>
                </div>
                <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={6000} open={this.state.isOpenWarningCart} onClose={() => this.setState({ isOpenWarningCart: false })}>
                    <MuiAlert onClose={() => this.setState({ isOpenWarningCart: false })} severity="warning" sx={{ width: '100%' }}>
                        Сначала авторизуйтесь, чтоб использовать корзину
                    </MuiAlert>
                </Snackbar>
                { this.state.isFilterOpen && <Filters onClose={this.toggleOpenFilter} updateFilters={this.props.updateFilters}/>}
                { this.state.isNotificationOpen && <Notification onClose={this.toggleOpenNotification}/>}
                { this.state.isCartOpen && <CartMenu onClose={this.toggleOpenCart}/>}
            </div>
        )
    }
};

export default Navbar;