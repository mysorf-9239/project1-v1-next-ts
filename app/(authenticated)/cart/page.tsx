'use client';

import React, {useState, useEffect} from "react";
import {getCart, removeAll, addToCart, subFromCart, removeFromCart} from "@/lib/utils/cartManager";
import CartCard from "@/lib/components/cartCard";
import {toast} from "react-toastify";
import formatNumber from "@/lib/utils/formatNumber";
import Image from "next/image";
import {useRouter} from "next/navigation";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
}

export default function Page() {
    const router = useRouter();
    const [cartData, setCartData] = useState<Product[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cart = getCart();
            setCartData(cart);

            const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
            setTotalAmount(total);
        }
    }, []);

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
        setTotalAmount(0);
        toast.success("Your cart has been cleared!");
    };

    const handleBack = async () => {
        router.push("/dashboard");
    }

    const handleOrder = () => {
        if (cartData.length > 0) {
            const deviceId = typeof window !== "undefined" ? localStorage.getItem("uuid") : null;
            const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

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
            })
                .then((response) => {
                    if (!response.ok) {
                        return Promise.reject(response);
                    }
                    return response.json();
                })
                .then(() => {
                    handleClearCart();
                    toast.success("Create bill success");
                })
                .catch((error) => {
                    if (error instanceof Response) {
                        error.json().then((data) => {
                            console.error(data.message);
                        });
                    } else {
                        console.error("Internal Server Error", error);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            toast.error("Cart is empty!");
        }
    };

    return (
        <>
            <title>Mysorf | Cart</title>

            <div className="flex flex-col h-[91.5vh]">
                <div
                    className="flex items-center justify-between bg-gradient-to-tr from-primary-300 via-primary-200 to-primary-400 text-secondary-900 h-12">
                    <span
                       className="flex items-center justify-center w-12 h-12 cursor-pointer"
                       onClick={handleBack}>
                        <i className="fa fa-arrow-left text-xl"/>
                    </span>
                    <h2 className="flex-1 text-2xl font-semibold my-auto text-center">Your cart</h2>
                    <span
                        className="flex items-center justify-center w-12 h-12 cursor-pointer"
                        onClick={handleClearCart}>
                        <i className="fa fa-trash-alt text-xl"/>
                    </span>
                </div>


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
                        <div className="flex flex-col h-[80vh] items-center justify-center space-y-10">
                            <Image
                                src="/empty-cart.jpg"
                                alt="Empty Cart"
                                className="w-36 h-36"
                                width={144}
                                height={144}
                            />
                            <p className="text-center mt-10">Your cart is empty.</p>
                        </div>
                    )}
                </div>

                <div className="w-full bg-white">
                    <p className="text-lg font-bold text-right pr-10 py-3">
                        Tổng tiền: {formatNumber(totalAmount)} đ</p>
                    <button
                        className="px-4 py-3 bg-gradient-to-br from-primary-300 via-primary-200 to-primary-400 text-secondary-900 font-bold rounded text-lg w-full"
                        onClick={handleOrder}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="fa fa-spinner animate-spin"></span>
                        ) : "Order"}
                    </button>
                </div>
            </div>
        </>
    );
}
