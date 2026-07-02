import React, { createContext, useEffect, useState } from "react";
import all_product from "../Utils/all_product";

export const ShopContext = createContext(null);

const getDefaultCart = ()=> {
    let cart = {};
    for (let index= 0; index<all_product.length+1; index++){
        cart[index] = 0
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(() => {
        if (typeof window === 'undefined') {
            return getDefaultCart();
        }

        const storedCart = window.localStorage.getItem('nike-reimagined-cart');

        if (storedCart) {
            try {
                return JSON.parse(storedCart);
            } catch {
                return getDefaultCart();
            }
        }

        return getDefaultCart();
    });

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        window.localStorage.setItem('nike-reimagined-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (itemId) => {
        setCartItems((prev)=> ({...prev, [itemId]:prev[itemId]+1}))
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev)=> ({...prev,[itemId]:prev[itemId]-1}))
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
    const contextValue = {all_product, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider
