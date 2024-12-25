'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import AddProduct from "@/lib/components/addProduct";
import {toast} from "react-toastify";
import Loading from "@/lib/components/Loading";

interface Product {
    id: number;
    name: string,
    description: string,
    price: number,
    image: string,
}

export default function Page() {
    const router = useRouter();

    const [isAdd, setIsAdd] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);

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
            console.log(data);
            setProducts(data);
        }).catch(() => {
            toast.error('Server Error');
        }).finally(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        getProduct();
    }, [router]);

    return (
        <>
            <title>Mysorf | Product Management</title>

            <div className="bg-amber-200 p-5 border border-black border-b-2 rounded">Create Product</div>

            <button
                onClick={() => setIsAdd(prev => !prev)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                {isAdd ? 'Cancel' : 'Add Product'}
            </button>

            {isLoading ? (
                <Loading/>
            ) : isAdd ? (
                <AddProduct/>
            ) : (
                <div className="mt-5">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id}
                                 className="border border-gray-300 p-3 mb-3 rounded-md shadow-md">
                                <p><strong>Name:</strong> {product.name}</p>
                                <p><strong>Description:</strong> {product.description}</p>
                                <p><strong>Price:</strong> {product.price}</p>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover mt-2"
                                />
                            </div>
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            )}
        </>
    );
}
