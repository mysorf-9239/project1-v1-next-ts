'use client';

import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import Loading from "@/lib/components/Loading";
import MenuManagerCard from "@/lib/components/menuManagerCard";
import {useRouter} from "next/navigation";

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

            <button
                onClick={() => setIsVisible(!isVisible)}
                className="border border-gray-300 p-3 mb-3 rounded-md shadow-md"
            >
                View
            </button>

            {isLoading ? (
                <Loading/>
            ) : isVisible ? (
                <div className="mt-5">
                    {menus.length > 0 ? (
                        menus.map((item) => (

                            <div key={item.id} className="mb-8 border rounded-xl p-4">
                                <p className="whitespace-nowrap text-xl font-semibold">{item.name}</p>
                                <p className="whitespace-nowrap text-sm">Description: {item.description}</p>
                                <p className="whitespace-nowrap">Number of products: {item.products.length}</p>
                            </div>
                        ))
                    ) : (
                        <p>No menus available.</p>
                    )}
                </div>
            ) : (
                <div className="mt-5">
                    {menus.length > 0 ? (
                        menus.map(menu => (
                            <MenuManagerCard
                                key={menu.id}
                                title={menu.name}
                                products={menu.products}
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