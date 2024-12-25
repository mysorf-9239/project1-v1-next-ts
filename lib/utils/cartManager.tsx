interface CartProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
}

export const getCart = () => {
    const cart = localStorage.getItem('cart');
    try {
        if (!cart) {
            localStorage.setItem('cart', JSON.stringify([]));
        }
        const parsedCart = cart ? JSON.parse(cart) : [];
        if (Array.isArray(parsedCart)) {
            return parsedCart;
        } else {
            return [];
        }
    } catch (e) {
        console.error("Error parsing cart data:", e);
        return [];
    }
};

export const addToCart = (product: CartProduct): void => {
    const cart = getCart();

    if (!Array.isArray(cart)) {
        console.error("Cart data is not an array", cart);
        return;
    }

    const existingItem = cart.find((item: CartProduct) => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
};

export const subFromCart = (productId: number): void => {
    let cart = getCart();
    const existingItem = cart.find((item: CartProduct) => item.id === productId);

    if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
    } else {
        cart = cart.filter((item: CartProduct) => item.id !== productId);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
};

export const removeFromCart = (productId: number): void => {
    let cart = getCart();
    const existingItem = cart.find((item: CartProduct) => item.id === productId);

    if (existingItem) {
        cart = cart.filter((item: CartProduct) => item.id !== productId);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
};

export const removeAll = () => {
    localStorage.setItem('cart', JSON.stringify([]));
}