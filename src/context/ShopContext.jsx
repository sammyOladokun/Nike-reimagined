import React, { createContext, useEffect, useState } from "react";
import all_product from "../Utils/all_product";
import { useAuth } from './AuthContext';
import { apiRequest } from '../lib/api';

export const ShopContext = createContext(null);

const CART_KEY_SEPARATOR = '::';
const DEFAULT_SIZE = 'UK 9';

const getLineKey = (itemId, size = DEFAULT_SIZE) => `${itemId}${CART_KEY_SEPARATOR}${size}`;

const parseLineKey = (lineKey) => {
    const [productIdPart, ...sizeParts] = String(lineKey).split(CART_KEY_SEPARATOR);
    const productId = Number(productIdPart);
    const size = sizeParts.join(CART_KEY_SEPARATOR).trim() || DEFAULT_SIZE;

    return {
        productId,
        size,
    };
};

const getDefaultCart = () => ({});

const normalizeCartShape = (cart = {}) => {
    const normalized = {};

    for (const [lineKey, rawQuantity] of Object.entries(cart)) {
        const quantity = Number(rawQuantity);

        if (!Number.isFinite(quantity) || quantity <= 0) {
            continue;
        }

        const { productId, size } = parseLineKey(lineKey);

        if (!productId) {
            continue;
        }

        const normalizedLineKey = getLineKey(productId, size);
        normalized[normalizedLineKey] = (normalized[normalizedLineKey] ?? 0) + quantity;
    }

    return normalized;
};

const readGuestCart = () => {
    if (typeof window === 'undefined') {
        return getDefaultCart();
    }

    const storedCart = window.localStorage.getItem('nike-reimagined-cart');

    if (!storedCart) {
        return getDefaultCart();
    }

    try {
        return normalizeCartShape(JSON.parse(storedCart));
    } catch {
        return getDefaultCart();
    }
}

const mergeCarts = (baseCart, incomingCart) => {
    const merged = normalizeCartShape(baseCart);

    for (const [lineKey, quantity] of Object.entries(normalizeCartShape(incomingCart))) {
        merged[lineKey] = (merged[lineKey] ?? 0) + quantity;
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

    const increaseQuantity = (lineKey) => {
        setCartItems((prev) => ({ ...prev, [lineKey]: (prev[lineKey] ?? 0) + 1 }))
    }

    const decreaseQuantity = (lineKey) => {
        setCartItems((prev) => {
            const currentQuantity = prev[lineKey] ?? 0;

            if (currentQuantity <= 1) {
                const nextCart = { ...prev };
                delete nextCart[lineKey];
                return nextCart;
            }

            return { ...prev, [lineKey]: currentQuantity - 1 };
        })
    }

    const addToCart = (itemId, size = DEFAULT_SIZE) => {
        const lineKey = getLineKey(itemId, size);
        increaseQuantity(lineKey)
    }

    const removeFromCart = (lineKey) => {
        decreaseQuantity(lineKey)
    }

    const clearItemFromCart = (lineKey) => {
        setCartItems((prev) => {
            const nextCart = { ...prev };
            delete nextCart[lineKey];
            return nextCart;
        })
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

    const getCartLineItems = () =>
        Object.entries(cartItems)
            .map(([lineKey, quantity]) => {
                const numericQuantity = Number(quantity);

                if (numericQuantity <= 0) {
                    return null;
                }

                const { productId, size } = parseLineKey(lineKey);
                const product = all_product.find((entry) => entry.id === productId);

                if (!product) {
                    return null;
                }

                return {
                    lineKey,
                    product,
                    productId,
                    size,
                    quantity: numericQuantity,
                    subtotal: product.new_price * numericQuantity,
                };
            })
            .filter(Boolean);

    const getTotalCartAmount = () => {
        return getCartLineItems().reduce((totalAmount, item) => totalAmount + item.subtotal, 0);
    }

    const getTotalCartItems = () => {
        return getCartLineItems().reduce((totalItem, item) => totalItem + item.quantity, 0);
    }
    const contextValue = {
        all_product,
        cartItems,
        getLineKey,
        parseLineKey,
        getCartLineItems,
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
