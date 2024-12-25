'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MenuCard from "@/lib/components/menuCard";
import {addToCart, getCart, subFromCart} from '@/lib/utils/cartManager';
import Loading from "@/lib/components/Loading";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity?: number;
}

interface Menu {
    id: number;
    name: string;
    description: string;
    products: Product[];
}

export default function Page() {
    const [isLoading, setIsLoading] = useState(true);
    const [menus, setMenus] = useState<Menu[]>([]);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (menus) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && {Authorization: `Bearer ${token}`}),
                },
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    return Promise.reject(response);
                })
                .then((data: Menu[]) => {
                    setMenus(data);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                    toast.error('Lỗi khi tải dữ liệu menu');
                });
        }
    }, [token, menus]);

    const getCartQuantities = () => {
        const cart = getCart();
        const quantities: { [key: number]: number } = {};

        cart.forEach((product) => {
            quantities[product.id] = product.quantity;
        });

        return quantities;
    };

    const updateProductsWithQuantities = (products: Product[]) => {
        const cartQuantities = getCartQuantities();
        return products.map((product) => ({
            ...product,
            quantity: cartQuantities[product.id] || 0,
        }));
    };

    const handleAddToCart = (product: Product) => {
        addToCart({ ...product, quantity: 1 });
        setMenus(prevMenus =>
            prevMenus.map(menu => ({
                ...menu,
                products: menu.products.map(p =>
                    p.id === product.id ? { ...p, quantity: (p.quantity || 0) + 1 } : p
                )
            }))
        );
        toast.success(`${product.name} đã được thêm vào giỏ hàng!`);
    };

    const handleSubFromCart = (product: Product) => {
        if (product.quantity && product.quantity > 0) {
            subFromCart(product.id);
            setMenus(prevMenus =>
                prevMenus.map(menu => ({
                    ...menu,
                    products: menu.products.map(p =>
                        p.id === product.id ? { ...p, quantity: Math.max((p.quantity || 0) - 1, 0) } : p
                    )
                }))
            );
            toast.info(`${product.name} đã được xoá khỏi giỏ hàng!`);
        } else {
            toast.error(`${product.name} chưa có trong giỏ hàng!`);
        }
    };

    return (
        <>
            <title>Mysorf | Dashboard</title>
            <div className="bg-amber-200 p-5 border border-black border-b-2 rounded">Dashboard</div>

            {isLoading ? (
                <Loading />
            ) : (
                <div className="mt-5">
                    {menus.length > 0 ? (
                        menus.map(menu => (
                            <MenuCard
                                key={menu.id}
                                title={menu.name}
                                products={updateProductsWithQuantities(menu.products)}
                                onAdd={handleAddToCart}
                                onSub={handleSubFromCart}
                            />
                        ))
                    ) : (
                        <p>No menus available.</p>
                    )}
                </div>
            )}
        </>
    );
}
