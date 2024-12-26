'use client';

import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import Loading from "@/lib/components/Loading";
import {MenuWithProduct, MenuOnly} from "@/lib/components/menuManagerCard";
import {useRouter} from "next/navigation";
import AddMenu from "@/lib/components/addMenu";
import SubmitButton from "@/lib/components/submitButton";
import HandlerError from "@/lib/utils/handlerError";
import SearchHeader from "@/lib/components/searchHeader";

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
        }).catch((error) => {
            HandlerError(error);
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

            <SearchHeader title="Menu Manager" holder="Enter menu name"/>

            <div className="relative pt-5">
                <div className="absolute top-2 right-10 flex items-center justify-center space-x-5">
                    {!isAdd && (
                        <SubmitButton
                            content={<span className={`fa ${isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></span>}
                            onClick={() => setIsVisible(!isVisible)}
                        />
                    )}
                    <SubmitButton
                        content={<span className={`fa ${isAdd ? 'fa-cancel' : 'fa-add'}`}></span>}
                        onClick={() => setIsAdd(!isAdd)}
                    />
                </div>
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
                        <div className="mt-5 px-5">
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
                        <div className="flex flex-col mt-5 px-5 space-y-8">
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