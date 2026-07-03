import React, { useEffect } from 'react'
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { NavbarMenu } from './Navbar';
import { useAuth } from '../context/AuthContext';


const ResponsiveMenu = ({showMenu, setShowMenu}) => {
  const { user, signOut } = useAuth()

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    if (showMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [showMenu])

  return (
    <div className={`${showMenu ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} fixed inset-0 z-40 transition-opacity duration-200 md:hidden`}>
      <button
        type="button"
        aria-label="Close mobile menu overlay"
        className="absolute inset-0 bg-black/50"
        onClick={() => setShowMenu(false)}
      />

      <div
        className={`${showMenu ? 'translate-x-0' : '-translate-x-full'} absolute left-0 top-0 flex h-full w-[82%] max-w-sm flex-col justify-between bg-white px-8 pb-6 pt-16 text-black shadow-2xl transition-transform duration-300 rounded-r-3xl`}
      >
        <div>
          <div className='flex items-center justify-start gap-3'>
              <FaUserCircle size={50}/>
              <div>
                  <h1>Welcome</h1>
                  <h1 className='text-sm text-slate-500'>Nike Reimagined</h1>
              </div>
          </div>
          <nav className='mt-12'>
              <ul className='space-y-4 text-sm flex flex-col'>
                  {NavbarMenu.map((item, index)=> (
                      <li key={index} onClick={()=>setShowMenu(false)}>
                          <Link to={item.link} className='inline-block text-base font-semibold py-2 px-3 uppercase'>
                          {item.title}
                          </Link>
                      </li>
                  ))}
              </ul>
          </nav>
          <div className='mt-10 border-t border-gray-200 pt-6'>
            {user ? (
              <div className='flex flex-col gap-3'>
                <Link
                  to='/account'
                  onClick={() => setShowMenu(false)}
                  className='rounded-xl border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900'
                >
                  My Account
                </Link>
                <button
                  type='button'
                  onClick={() => {
                    signOut()
                    setShowMenu(false)
                  }}
                  className='rounded-xl bg-gray-950 px-4 py-3 font-semibold text-white'
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className='flex flex-col gap-3'>
                <Link
                  to='/auth?mode=signin'
                  onClick={() => setShowMenu(false)}
                  className='rounded-xl bg-gray-950 px-4 py-3 text-center font-semibold text-white'
                >
                  Sign in
                </Link>
                <Link
                  to='/auth?mode=signup'
                  onClick={() => setShowMenu(false)}
                  className='rounded-xl border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900'
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResponsiveMenu
