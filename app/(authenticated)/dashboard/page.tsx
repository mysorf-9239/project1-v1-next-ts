'use client';

import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import MenuCard from "@/lib/components/menuCard";
import {addToCart, getCart, subFromCart} from '@/lib/utils/cartManager';
import Loading from "@/lib/components/Loading";
import SearchHeader from "@/lib/components/searchHeader";
import EmptyContent from "@/lib/components/emptyContent";

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
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        if (menus) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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
                    toast.error('Internal server error');
                });
        }
    }, [menus]);

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
        addToCart({...product, quantity: 1});
        setMenus(prevMenus =>
            prevMenus.map(menu => ({
                ...menu,
                products: menu.products.map(p =>
                    p.id === product.id ? {...p, quantity: (p.quantity || 0) + 1} : p
                )
            }))
        );
        toast.success(`${product.name} has been added to cart!`);
    };

    const handleSubFromCart = (product: Product) => {
        if (product.quantity && product.quantity > 0) {
            subFromCart(product.id);
            setMenus(prevMenus =>
                prevMenus.map(menu => ({
                    ...menu,
                    products: menu.products.map(p =>
                        p.id === product.id ? {...p, quantity: Math.max((p.quantity || 0) - 1, 0)} : p
                    )
                }))
            );
            toast.info(`${product.name} has been removed from cart!`);
        } else {
            toast.error(`${product.name} not in cart!`);
        }
    };

    const filteredMenus = menus.map(menu => ({
        ...menu,
        products: menu.products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter(menu => menu.products.length > 0);

    return (
        <>
            <title>Mysorf | Dashboard</title>

            <SearchHeader
                title="Dashboard"
                holder="Search with product name"
                onSearchChange={(e) => setSearchQuery(e.target.value)}
            />

            {isLoading ? (
                <Loading/>
            ) : (
                <div className="mt-5">
                    {filteredMenus.length > 0 ? (
                        filteredMenus.map(menu => (
                            <MenuCard
                                key={menu.id}
                                title={menu.name}
                                products={updateProductsWithQuantities(menu.products)}
                                onAdd={handleAddToCart}
                                onSub={handleSubFromCart}
                            />
                        ))
                    ) : (
                        <EmptyContent
                            title="No menus found"
                            description="Try searching with different name."
                        />
                    )}
                </div>
            )}
        </>
    );
}
