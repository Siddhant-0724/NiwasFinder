import logo from '../assets/logo/logo-color.png';
import { FaSearch, FaBars } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const Header = () => {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState('');
    const [menuOpen, setMenuOpen] = useState(false); // For mobile menu toggle

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('search', search);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTerm = urlParams.get('search');
        if (searchTerm) {
            setSearch(searchTerm);
        }
    }, [location.search]);

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex items-center justify-between max-w-6xl mx-auto p-3'>
                {/* Logo */}
                <Link to="/">
                    <div className='h-16 w-36'>
                        <img className='w-full h-full object-contain p-3 lg:p-0' src={logo} alt="Company Logo" />
                    </div>
                </Link>

                {/* Hamburger Menu Icon for Mobile */}
                <button 
                    className='sm:hidden text-xl text-gray-700' 
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <FaBars />
                </button>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className='absolute top-16 left-0 right-0 bg-white shadow-lg p-4 z-50 sm:hidden'>
                        <ul className='flex flex-col items-center space-y-4'>
                            <Link to="/home">
                                <li className='text-slate-700 hover:underline'>Home</li>
                            </Link>
                            <Link to="/about">
                                <li className='text-slate-700 hover:underline'>About</li>
                            </Link>
                            <Link to="/profile">
                                {currentUser ? (
                                    <img src={currentUser.avatar} alt="profile" className='rounded-full h-10 w-10 object-cover' />
                                ) : (
                                    <li className='text-slate-700 hover:underline'>Login</li>
                                )}
                            </Link>
                        </ul>
                    </div>
                )}

                {/* Search Input */}
                <form 
                    onSubmit={handleSubmit} 
                    className='hidden sm:flex items-center bg-slate-100 p-2 rounded-lg w-full max-w-md mx-auto'
                >
                    <input
                        value={search}
                        type="text"
                        placeholder='Search...'
                        className='bg-transparent outline-none text-gray-800 w-full focus:outline-none'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">
                        <FaSearch className='text-gray-700' />
                    </button>
                </form>

                {/* Navlinks for Larger Screens */}
                <ul className='hidden sm:flex gap-8 mr-2 items-center font-semibold'>
                    <Link to="/home">
                        <li className='text-slate-700 hover:underline'>Home</li>
                    </Link>
                    <Link to="/about">
                        <li className='text-slate-700 hover:underline'>About</li>
                    </Link>
                    <Link to="/profile">
                        {currentUser ? (
                            <img src={currentUser.avatar} alt="profile" className='rounded-full h-10 w-10 object-cover' />
                        ) : (
                            <li className='text-slate-700 hover:underline'>Login</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    );
};

export default Header;
