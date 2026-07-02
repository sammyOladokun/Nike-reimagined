import React, { createContext, useEffect, useState } from "react";
import all_product from "../Utils/all_product";
import { useAuth } from './AuthContext';
import { apiRequest } from '../lib/api';

export const ShopContext = createContext(null);

const getDefaultCart = ()=> {
    let cart = {};
    for (let index= 0; index<all_product.length+1; index++){
        cart[index] = 0
    }
    return cart;
}

const readGuestCart = () => {
    if (typeof window === 'undefined') {
        return getDefaultCart();
    }

    const storedCart = window.localStorage.getItem('nike-reimagined-cart');

    if (!storedCart) {
        return getDefaultCart();
    }

    try {
        return JSON.parse(storedCart);
    } catch {
        return getDefaultCart();
    }
}

const mergeCarts = (baseCart, incomingCart) => {
    const merged = getDefaultCart();

    for (const productId of Object.keys(merged)) {
        merged[productId] = (baseCart[productId] ?? 0) + (incomingCart[productId] ?? 0);
    }

    return merged;
}

const ShopContextProvider = (props) => {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [cartItems, setCartItems] = useState(() => readGuestCart());

    useEffect(() => {
        if (typeof window === 'undefined' || isAuthLoading) {
            return;
        }

        let cancelled = false;

        const hydrateCart = async () => {
            try {
                if (user) {
                    const [cartResult, guestCart] = await Promise.all([
                        apiRequest('/api/cart'),
                        Promise.resolve(readGuestCart()),
                    ]);
                    const backendCart = cartResult.cart?.items ?? {};
                    const mergedCart = mergeCarts(backendCart, guestCart);

                    if (!cancelled) {
                        setCartItems(mergedCart);
                    }

                    if (Object.values(guestCart).some((quantity) => quantity > 0)) {
                        await apiRequest('/api/cart', {
                            method: 'PUT',
                            body: JSON.stringify({ items: mergedCart }),
                        });
                    }

                    window.localStorage.removeItem('nike-reimagined-cart');
                } else {
                    if (!cancelled) {
                        setCartItems(readGuestCart());
                    }
                }
            } catch (error) {
                console.error('Failed to hydrate cart', error);
            }
        };

        hydrateCart();

        return () => {
            cancelled = true;
        };
    }, [user, isAuthLoading]);

    useEffect(() => {
        if (typeof window === 'undefined' || isAuthLoading) {
            return;
        }

        if (user) {
            apiRequest('/api/cart', {
                method: 'PUT',
                body: JSON.stringify({ items: cartItems }),
            }).catch((error) => {
                console.error('Failed to sync cart', error);
            });
            return;
        }

        window.localStorage.setItem('nike-reimagined-cart', JSON.stringify(cartItems));
    }, [cartItems, user, isAuthLoading]);

    const increaseQuantity = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] ?? 0) + 1 }))
    }

    const decreaseQuantity = (itemId) => {
        setCartItems((prev) => {
            const currentQuantity = prev[itemId] ?? 0;

            if (currentQuantity <= 1) {
                return { ...prev, [itemId]: 0 };
            }

            return { ...prev, [itemId]: currentQuantity - 1 };
        })
    }

    const addToCart = (itemId) => {
        increaseQuantity(itemId)
    }

    const removeFromCart = (itemId) => {
        decreaseQuantity(itemId)
    }

    const clearItemFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: 0 }))
    }

    const clearCart = () => {
        setCartItems(getDefaultCart())

        if (user) {
            apiRequest('/api/cart', {
                method: 'PUT',
                body: JSON.stringify({ items: getDefaultCart() }),
            }).catch((error) => {
                console.error('Failed to clear cart', error);
            });
        }
    }

    const getTotalCartAmount = ()=> {
        let totalAmount = 0;
        for (const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                let itemInfo = all_product.find((product)=>product.id===Number(item))
                totalAmount += cartItems[item] * itemInfo.new_price;
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = ()=> {
        let totalItem = 0;
        for (const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                totalItem += cartItems[item]
            }
        }
        return totalItem;
    }
    const contextValue = {
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearItemFromCart,
        clearCart,
        getTotalCartAmount,
        getTotalCartItems,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider
