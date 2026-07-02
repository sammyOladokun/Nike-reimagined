import React, { useContext, useEffect, useState } from 'react'
import Logo from '../assets/logo2.png'
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { FaRegUser } from "react-icons/fa";
import { HiMenuAlt1, HiMenuAlt3, } from "react-icons/hi";
import ResponsiveMenu from './ResponsiveMenu';
import { UpdateFollower } from 'react-mouse-follower';
import { NavbarMenu } from './Navbar';
import { ShopContext } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import MiniCartDrawer from './MiniCartDrawer';

const Navbar2 = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [miniCartOpen, setMiniCartOpen] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem('nike-mini-cart-open') === 'true'
  })
  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }
  const {getTotalCartItems} = useContext(ShopContext)
  const { user, signOut } = useAuth()
  const openMiniCart = () => setMiniCartOpen(true)
  const closeMiniCart = () => setMiniCartOpen(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem('nike-mini-cart-open', String(miniCartOpen))
  }, [miniCartOpen])

  return (
    <div className='text-black py-2 bg-gray-100 z-10'>
      <div className='container flex justify-between items-center'>
        {/* logo section */}
        <div>
          <img src={Logo} alt="" className='max-w-[100px]' />
        </div>
        {/* menu section */}
        <div className='hidden md:block'>
          <ul className='flex items-center gap-4 relative z-40'>
            {NavbarMenu.map((item, index) => (
              <li key={index}>
                <UpdateFollower
                  mouseOptions={{
                    backgroundColor: "white",
                    zIndex: 9999,
                    followSpeed: 1.5,
                    scale: 5,
                    mixBlendMode: "difference"
                  }}
                >
                  <Link to={item.link} className='inline-block text-base font-semibold py-2 px-3 uppercase'>
                    {item.title}
                  </Link>
                </UpdateFollower>
              </li>
            ))}
            <UpdateFollower
              mouseOptions={{
                backgroundColor: "white",
                zIndex: 9999,
                followSpeed: 1.5,
                scale: 5,
                mixBlendMode: "difference"
              }}
            >
              <button type="button" onClick={openMiniCart} className='relative'>
                <ShoppingCart />
                <div className='bg-[#138695] w-5 absolute -top-3 -right-2 flex items-center justify-center rounded-full text-white text-[11px] font-semibold'>
                  {getTotalCartItems()}
                </div>
              </button>
            </UpdateFollower>
            <UpdateFollower
              mouseOptions={{
                backgroundColor: "white",
                zIndex: 9999,
                followSpeed: 1.5,
                scale: 5,
                mixBlendMode: "difference"
              }}
            >
              {user ? (
                <div className='flex items-center gap-4 ps-8'>
                  <Link to='/account' className='text-xl'>
                    <FaRegUser />
                  </Link>
                  <button type="button" onClick={signOut} className='text-sm font-semibold uppercase'>
                    Sign out
                  </button>
                </div>
              ) : (
                <Link to='/auth' className='text-xl ps-8'>
                  <FaRegUser />
                </Link>
              )}
            </UpdateFollower>

          </ul>
        </div>
        <div className='flex gap-8 md:hidden z-50'>
          <button type="button" onClick={openMiniCart} className='relative w-10 z-50'>
            <ShoppingCart />
            <div className='bg-[#138695] z-40 w-5 absolute -top-2 right-1 flex items-center justify-center rounded-full text-white text-[11px] font-semibold'>
              {getTotalCartItems()}
            </div>
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

export default Navbar2
