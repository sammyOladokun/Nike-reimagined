import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { ShopContext } from '../context/ShopContext'

const MiniCartDrawer = ({ open, onClose }) => {
  const {
    getCartLineItems,
    increaseQuantity,
    decreaseQuantity,
    clearItemFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  } = useContext(ShopContext)

  const cartLineItems = getCartLineItems()

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (open) {
      window.addEventListener('keydown', handleEscape)
    }

    return () => window.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  return (
    <div className={`${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} fixed inset-0 z-50 transition-opacity duration-200`}>
      <button
        type="button"
        aria-label="Close mini cart overlay"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <aside className={`${open ? 'translate-x-0' : 'translate-x-full'} absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300`}>
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Mini cart</p>
            <h2 className="text-lg font-semibold text-gray-900">Your basket</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close mini cart"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {getTotalCartItems() === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-gray-500">
              <ShoppingBag size={42} className="text-gray-300" />
              <div>
                <p className="text-lg font-semibold text-gray-900">Your cart is empty</p>
                <p className="text-sm">Add a few pieces and they’ll show up here.</p>
              </div>
              <Link
                to="/mens"
                onClick={onClose}
                className="rounded-full bg-[#138695] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Shop now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartLineItems.map((item) => (
                <div key={item.lineKey} className="rounded-2xl border border-gray-200 p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-500">${item.product.new_price} each</p>
                          <p className="text-xs text-gray-400">Size {item.size}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => clearItemFromCart(item.lineKey)}
                          className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-gray-200">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.lineKey)}
                            className="px-3 py-2 text-gray-600 transition hover:bg-gray-100"
                            aria-label={`Decrease ${item.product.name} quantity`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-10 px-3 text-center text-sm font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.lineKey)}
                            className="px-3 py-2 text-gray-600 transition hover:bg-gray-100"
                            aria-label={`Increase ${item.product.name} quantity`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <p className="text-sm font-semibold text-gray-900">
                          ${item.subtotal}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-5 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Items</span>
            <span>{getTotalCartItems()}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-lg font-semibold text-gray-900">
            <span>Subtotal</span>
            <span>${getTotalCartAmount()}</span>
          </div>

          <div className="mt-4 grid gap-3">
            <Link
              to="/checkout"
              onClick={onClose}
              className="rounded-full bg-[#138695] px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
            >
              Proceed to checkout
            </Link>
            <Link
              to="/cart"
              onClick={onClose}
              className="rounded-full border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              View full cart
            </Link>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default MiniCartDrawer
