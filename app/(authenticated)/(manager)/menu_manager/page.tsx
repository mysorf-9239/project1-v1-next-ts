'use client';

import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import Loading from "@/lib/components/Loading";
import {MenuWithProduct, MenuOnly} from "@/lib/components/menuManagerCard";
import {useRouter} from "next/navigation";
import AddMenu from "@/lib/components/addMenu";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

interface Menu {
    id: number;
    name: string;
    description: string;
    products: Product[];
}

export default function Page() {
    const router = useRouter();

    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const getMenu = () => {
        setIsLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        }).then((data: Menu[]) => {
            setMenus(data);
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
            toast.error('Lỗi khi tải dữ liệu menu');
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const getProduct = () => {
        setIsLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        }).then((data: Product[]) => {
            setProducts(data);
        }).catch(() => {
            toast.error('Lỗi khi tải dữ liệu menu');
        }).finally(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        getProduct();
        getMenu();
    }, [router]);

    return (
        <>
            <title>Mysorf | Menu Management</title>

            <div className="bg-amber-200 p-5 border border-black border-b-2 rounded">Cart</div>

            <div>
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="border border-gray-300 p-3 mb-3 rounded-md shadow-md"
                >
                    View
                </button>
                <button
                    onClick={() => setIsAdd(!isAdd)}
                    className="border border-gray-300 p-3 mb-3 rounded-md shadow-md"
                >
                    Add Menu
                </button>
            </div>

            {isAdd ? (
                <AddMenu
                    products={products}
                />
            ) : (
                <>
                    {isLoading ? (
                        <Loading/>
                    ) : isVisible ? (
                        <div className="mt-5">
                            {menus.length > 0 ? (
                                menus.map((item) => (
                                    <MenuOnly
                                        key={item.id}
                                        id={item.id}
                                        title={item.name}
                                        description={item.description}
                                        products={item.products}
                                        allProducts={products}
                                    />
                                ))
                            ) : (
                                <p>No menus available.</p>
                            )}
                        </div>
                    ) : (
                        <div className="mt-5">
                            {menus.length > 0 ? (
                                menus.map(menu => (
                                    <MenuWithProduct
                                        key={menu.id}
                                        title={menu.name}
                                        description={menu.description}
                                        products={menu.products}
                                    />
                                ))
                            ) : (
                                <p>No menus available.</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    );
}