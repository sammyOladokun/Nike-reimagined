import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home'
import Contact from './Pages/Contact'
import Cart from './Pages/Cart'
import Footer from './components/Footer'
import { UpdateFollower } from 'react-mouse-follower'
import ProductList from './components/ProductList'
import Navbar2 from './components/Navbar2'
import SingleProduct from './components/SingleProduct'
import Auth from './Pages/Auth'
import Checkout from './Pages/Checkout'
import OrderSuccess from './Pages/OrderSuccess'
import Account from './Pages/Account'

const router = createBrowserRouter([
  {
    path:'/',
    element: <><Home/><Footer/></>
  },
  {
    path:'/mens',
    element: <><Navbar2/><ProductList category="men"/><Footer/></>
  },
  {
    path:'/womens',
    element: <><Navbar2/><ProductList category="women"/><Footer/></>
  },
  {
    path:'/kids',
    element: <><Navbar2/><ProductList category="kid"/><Footer/></>
  },
  {
    path:'/contact',
    element: <><Navbar2/><Contact/><Footer/></>
  },
  {
    path:'/auth',
    element: <><Navbar2/><Auth/><Footer/></>
  },
  {
    path:'/checkout',
    element: <><Navbar2/><Checkout/><Footer/></>
  },
  {
    path:'/order-success',
    element: <><Navbar2/><OrderSuccess/><Footer/></>
  },
  {
    path:'/account',
    element: <><Navbar2/><Account/><Footer/></>
  },
  {
    path: "/products/:productId",
    element: <><Navbar2/><SingleProduct/><Footer/></>
  },
  {
    path:'/cart',
    element: <><Navbar2/><Cart/><Footer/></>
  },
 
])

const App = () => {
  return (
    <main className='overflow-x-hidden'>
      <UpdateFollower
      mouseOptions={{
        backgroundColor: "white",
        zIndex: 10,
        followSpeed: 1.5,
      }}
      >
     <RouterProvider router={router}/>
     </UpdateFollower>
    </main>
  )
}

export default App
