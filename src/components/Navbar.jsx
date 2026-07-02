import React, { useContext, useEffect, useState } from 'react'
import Logo from '../assets/logo2.png'
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { FaRegUser } from "react-icons/fa";
import { HiMenuAlt1, HiMenuAlt3, } from "react-icons/hi";
import ResponsiveMenu from './ResponsiveMenu';
import { useAuth } from '../context/AuthContext';
import { ShopContext } from '../context/ShopContext';
import MiniCartDrawer from './MiniCartDrawer';


export const NavbarMenu = [
  {
    id: 1,
    title: "Home",
    link: "/",
  },
  {
    id: 2,
    title: "Men",
    link: "/mens",
  },
  {
    id: 3,
    title: "Women",
    link: "/womens",
  },
  {
    id: 4,
    title: "Kids",
    link: "/kids",
  },
  {
    id: 5,
    title: "Contact",
    link: "/contact",
  },
];

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [miniCartOpen, setMiniCartOpen] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem('nike-mini-cart-open') === 'true'
  })
  const { getTotalCartItems } = useContext(ShopContext)
  const { user, signOut } = useAuth()
  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }
  const openMiniCart = () => setMiniCartOpen(true)
  const closeMiniCart = () => setMiniCartOpen(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem('nike-mini-cart-open', String(miniCartOpen))
  }, [miniCartOpen])

  return (
    <div className='text-white py-8'>
      <div className='container flex justify-between items-center'>
        {/* logo section */}
        <div>
          <img src={Logo} alt="" className='max-w-[100px] invert' />
        </div>
        {/* menu section */}
        <div className='hidden md:block'>
          <ul className='flex items-center gap-4 relative z-40'>
            {NavbarMenu.map((item, index) => (
              <li key={index}>
                <Link to={item.link} className='inline-block text-base font-semibold py-2 px-3 uppercase'>
                  {item.title}
                </Link>
              </li>
            ))}
            <button type="button" onClick={openMiniCart} className='relative inline-flex h-10 w-10 items-center justify-center text-xl'>
              <ShoppingCart />
              <span className='absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#138695] px-1 text-[11px] font-semibold text-white'>
                {getTotalCartItems()}
              </span>
            </button>
            {user ? (
              <div className='ml-8 flex items-center gap-4'>
                <Link to='/account' className='inline-flex h-10 w-10 items-center justify-center text-xl'>
                  <FaRegUser size={24} />
                </Link>
                <button type="button" onClick={signOut} className='text-sm font-semibold uppercase'>
                  Sign out
                </button>
              </div>
            ) : (
              <Link to='/auth' className='ml-8 inline-flex h-10 w-10 items-center justify-center shrink-0'>
                <FaRegUser size={22} />
              </Link>
            )}

          </ul>
        </div>
        <div className='flex gap-8 md:hidden z-50'>
          <button type="button" onClick={openMiniCart} className='relative w-10'>
            <ShoppingCart />
            <span className='absolute -right-1 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#138695] px-1 text-[11px] font-semibold text-white'>
              {getTotalCartItems()}
            </span>
          </button>
          {/* mobile hamburger menu */}
          {
            showMenu ? (
              <HiMenuAlt1 onClick={toggleMenu} className='cursor-pointer transition-all md:hidden z-50' size={30} />
            ) : (
              <HiMenuAlt3 onClick={toggleMenu} className='cursor-pointer transition-all md:hidden z-50' size={30} />
            )
          }
        </div>
      </div>
      <div>
        <ResponsiveMenu showMenu={showMenu} setShowMenu={setShowMenu} />
      </div>
      <MiniCartDrawer open={miniCartOpen} onClose={closeMiniCart} />
    </div>
  )
}

export default Navbar
