'use client';

import React, {useState, useEffect} from "react";
import {getCart, removeAll, addToCart, subFromCart, removeFromCart} from "@/lib/utils/cartManager";
import CartCard from "@/lib/components/cartCard";
import {toast} from "react-toastify";
import Loading from "@/lib/components/Loading";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
}

export default function Page() {
    const [cartData, setCartData] = useState<Product[]>(getCart());
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const total = cartData.reduce((sum, product) => sum + product.price * product.quantity, 0);
        setTotalAmount(total);
    }, [cartData]);

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        setCartData(getCart());
    };

    const handleSubFromCart = (product: Product) => {
        if (product.quantity > 0) {
            subFromCart(product.id);
            setCartData(getCart());
        }
    };

    const handleRemoveProduct = (product: Product) => {
        removeFromCart(product.id);
        setCartData(getCart());
    };

    const handleClearCart = () => {
        removeAll();
        setCartData([]);
    };

    const handleOrder = () => {
        if (cartData.length > 0) {

            const deviceId = localStorage.getItem("uuid");
            const token = localStorage.getItem("accessToken");

            if (!deviceId) {
                toast.error("Device ID is missing.");
                return;
            }

            const orderData = {
                device_id: deviceId,
                products: cartData.map((product) => ({
                    product_id: product.id,
                    quantity: product.quantity
                }))
            };

            setLoading(true);

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/bills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(token && {Authorization: `Bearer ${token}`}),
                },
                body: JSON.stringify(orderData),
            }).then((response) => {
                if (!response.ok) {
                    return Promise.reject(response);
                }

                return response.json();
            }).then(() => {
                handleClearCart();
                toast.success("Create bill success");
            }).catch((error) => {
                if (error instanceof Response) {
                    error.json().then((data) => {
                        console.error(data.message);
                    });
                } else {
                    console.error("Internal Server Error", error);
                }
            }).finally(() => {
                setLoading(false);
            });
        } else {
            toast.error("Cart is empty!");
        }
    }

    return (
        <>
            <title>Mysorf | Cart</title>

            <div className="flex flex-col h-screen">
                <div
                    className="flex items-center justify-between bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-500 text-blue-900 h-12">
                    <span className="w-12 h-12"></span>
                    <h2 className="flex-1 text-2xl font-semibold my-auto text-center">Giỏ hàng của bạn</h2>
                    <span
                        className="flex items-center justify-center w-12 h-12 cursor-pointer"
                        onClick={handleClearCart}>
                        <i className="fa fa-trash-alt text-xl"/>
                    </span>
                </div>

                {loading ? (
                    <Loading/>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        {cartData.length > 0 ? (
                            <div
                                className="flex flex-col space-y-3 lg:px-20 md:px-10 px-5 py-5 justify-center items-center">
                                {cartData.map((product) => (
                                    <CartCard
                                        key={product.id}
                                        product={product}
                                        onAdd={handleAddToCart}
                                        onSub={handleSubFromCart}
                                        onRemove={handleRemoveProduct}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center mt-10">Giỏ hàng của bạn đang trống.</p>
                        )}
                    </div>
                )}

                <div className="w-full bg-white">
                    <p className="text-lg font-bold text-right pr-10 py-3">
                        Tổng tiền: {totalAmount.toLocaleString()} đ</p>
                    <button
                        className="px-4 py-3 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-500 text-blue-900 font-bold rounded text-lg w-full"
                        onClick={handleOrder}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Gọi món"}
                    </button>
                </div>
            </div>
        </>
    );
}
