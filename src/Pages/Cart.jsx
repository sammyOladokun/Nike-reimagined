import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Minus, Plus, X } from 'lucide-react'
import EmptyCart from '../assets/EmptyCart.png'
import { Link } from 'react-router-dom'

const Cart = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const {
    getTotalCartItems,
    getCartLineItems,
    increaseQuantity,
    decreaseQuantity,
    clearItemFromCart,
    getTotalCartAmount,
  } = useContext(ShopContext)

  const cartLineItems = getCartLineItems()

  return (
    <div>
      <div className='max-w-7xl mx-auto my-10 p-4'>
        {getTotalCartItems() === 0 ? <div className='flex items-center justify-center'><img src={EmptyCart} alt='' /></div> : <div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[0.5fr,2fr,0.8fr,1fr,1fr,1fr] items-center px-4'>
            <p>Products</p>
            <p>Title</p>
            <p className='hidden md:block'>Size</p>
            <p className='hidden md:block'>Price</p>
            <p className='hidden md:block'>Quantity</p>
            <p className='hidden md:block'>Total</p>
            <p className='hidden md:block'>Remove</p>
          </div>
          <hr className='bg-gray-300 border-0 h-[2px] my-2' />
          {cartLineItems.map((item) => (
            <div key={item.lineKey}>
              <div className='text-gray-500 font-semibold text-sm sm:text-base grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[0.5fr,2fr,0.8fr,1fr,1fr,1fr] items-center px-4 gap-2'>
                <img src={item.product.image} className='h-16 w-16 object-cover' alt="" />
                <div>
                  <p>{item.product.name}</p>
                  <p className='mt-1 text-xs text-gray-400 md:hidden'>Size: {item.size}</p>
                </div>
                <p className='hidden md:block'>{item.size}</p>
                <p className='hidden md:block'>${item.product.new_price}</p>
                <div className='flex items-center justify-start'>
                  <div className='flex items-center rounded-full border border-gray-300 bg-white'>
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.lineKey)}
                      className='px-3 py-2 text-gray-600 transition hover:bg-gray-100'
                      aria-label={`Decrease ${item.product.name} quantity`}
                    >
                      <Minus size={14} />
                    </button>
                    <span className='min-w-10 px-3 text-center font-semibold text-gray-900'>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.lineKey)}
                      className='px-3 py-2 text-gray-600 transition hover:bg-gray-100'
                      aria-label={`Increase ${item.product.name} quantity`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <p className='hidden md:block'>${item.subtotal}</p>
                <button
                  type="button"
                  onClick={() => { clearItemFromCart(item.lineKey) }}
                  className='inline-flex justify-self-start rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900'
                  aria-label={`Remove ${item.product.name} from cart`}
                >
                  <X size={18} />
                </button>
              </div>
              <hr className='bg-gray-300 border-0 h-[2px] my-2'/>
            </div>
          ))}
          <div className='flex flex-col lg:flex-row my-12 gap-10 md:gap-32'>
            <div className='flex-1 flex flex-col gap-4'>
              <h1 className='text-lg font-bold'>Cart Totals</h1>
              <div>
                <div className='flex justify-between py-2'>
                  <p>Subtotal</p>
                  <p>${getTotalCartAmount()}</p>
                </div>
                <hr className='bg-gray-300 border-0 h-[2px] my-2'/>
                <div className='flex justify-between py-2'>
                  <p>Shipping Fee</p>
                  <p>Free</p>
                </div>
                <hr className='bg-gray-300 border-0 h-[2px] my-2'/>
                <div className='flex justify-between text-xl font-semibold py-2'>
                  <h3>Total</h3>
                  <h3>${getTotalCartAmount()}</h3>
                </div>
              </div>
              <Link to='/checkout'>
              <button className='w-full lg:w-64 h-14 bg-[#138695] text-white font-semibold text-lg'>PROCEED TO CHECKOUT</button>
              </Link>
            </div>
            <div className='flex-1 w-full text-lg font-semibold'>
              <p className='text-gray-600'>If you have a promo code, enter it here:</p>
              <div className='w-full lg:w-80 mt-2 flex'>
                <input type="text" placeholder='Promo code' className='flex-1 h-14 p-2 bg-gray-200'/>
                <button className='h-14 w-32 px-4 py-1 bg-gray-800 text-white'>Submit</button>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  )
}

export default Cart
