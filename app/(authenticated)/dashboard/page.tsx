'use client';

import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    created_at: string;
    updated_at: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    MenuProducts: {
        menu_id: number;
        product_id: number;
    };
}

interface Menu {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    products: Product[];
}

export default function Page() {
    const [isLoading, setIsLoading] = useState(true);

    const [menus, setMenus] = useState<Menu[]>([]);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token && {Authorization: `Bearer ${token}`}),
            },
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        }).then((data: Menu[]) => {
            setIsLoading(false);
            setMenus(data);
        }).catch(error => {
            if (error instanceof Response) {
                error.json().then((data) => {
                    toast.error(
                        <div className="text-black space-y-2 px-3">
                            <p>{data.message}</p>
                        </div>, {
                            position: "top-right",
                            autoClose: 5_000,
                            hideProgressBar: true,
                            className: "bg-red-100 border border-black rounded-xl w-full shadow-[0px_5px_0px_0px_#191A23]",
                            closeButton: false
                        });
                })
            } else {
                toast.error(
                    <div className="text-black space-y-2 px-3">
                        <p>Server Error</p>
                    </div>, {
                        position: "top-right",
                        autoClose: 5_000,
                        hideProgressBar: true,
                        className: "bg-red-100 border border-black rounded-xl w-full shadow-[0px_5px_0px_0px_#191A23]",
                        closeButton: false
                    });
            }
        });
    }, [token]);

    return (
        <>
            <title>Mysorf | Dashboard</title>

            <div className="bg-amber-200 p-5 border border-black border-b-2 rounded">Dashboard</div>

            {isLoading ? (
                <p>Loading....</p>
            ) : (
                <div className="mt-5">
                    {menus.length > 0 ? (
                        menus.map((menu) => (
                            <div key={menu.id} className="border p-4 rounded-lg mb-4">
                                <h3 className="text-xl font-bold">{menu.name}</h3>
                                <p>{menu.description}</p>
                                <div className="mt-4">
                                    <h4 className="font-semibold">Products:</h4>
                                    <ul>
                                        {menu.products.map((product) => (
                                            <li key={product.id} className="border-b py-2">
                                                <strong>{product.name}</strong> - {product.description} <br/>
                                                Price: ${product.price}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No menus available.</p>
                    )}
                </div>
            )}
        </>
    );
}
