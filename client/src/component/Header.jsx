import logo from '../assets/logo/logo-color.png';
import { FaSearch } from 'react-icons/fa'
import { Link ,useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react';
const Header = () => {
    const { currentUser } = useSelector(state => state.user)
    const navigate = useNavigate() 
    const [search,setSearch] = useState("")
    const handelSubmit=(e)=>{
        e.preventDefault();
        
        const urlParams =new URLSearchParams(window.location.search);
        urlParams.set(`search`,search);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }
    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search)
        const searchTerm = urlParams.get('search')
        if(searchTerm){
            setSearch(searchTerm)
        }
    },[location.search])
    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex items-center justify-between max-w-6xl mx-auto p-3'>
                {/* Logo */}
                <Link to="/">
                    <div className='h-16 w-36'>
                        <img className='w-full h-full object-contain p-3 lg:p-0' src={logo} alt="Company Logo" />
                    </div>
                </Link>

                {/* Search Input */}
                <form onSubmit={handelSubmit} className=' flex items-center bg-slate-100 p-3 rounded-lg'>
                    <input
                        value={search}
                        type="text"
                        placeholder='Search...'
                        className='bg-transparent outline-none text-gray-800  focus:outline-none w-32 sm:w-72'
                        onChange={(e)=>setSearch(e.target.value)}
                    />
                    <button>
                    <FaSearch className='text-gray-700' />
                    </button>
                </form>

                {/* Navlinks */}
                <ul className='flex gap-8 mr-2 items-center font-semibold'>
                    <Link to="/home">
                        <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                    </Link>
                    <Link to="/about">
                        <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
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
