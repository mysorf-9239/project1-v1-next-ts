'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import AddProduct from "@/lib/components/addProduct";
import {toast} from "react-toastify";
import Loading from "@/lib/components/Loading";
import SubmitButton from "@/lib/components/submitButton";
import ProductManagerCard from "@/lib/components/ProductManagerCard";
import SearchHeader from "@/lib/components/searchHeader";

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
    const [searchQuery, setSearchQuery] = useState<string>('');

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

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        getProduct();
    }, [router]);

    return (
        <>
            <title>Mysorf | Product Management</title>

            <SearchHeader
                title="Product Manager"
                holder="Search with product name"
                onSearchChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="relative pt-5">
                <div className="absolute top-2 right-10 flex items-center justify-center space-x-5 z-10">
                    <SubmitButton
                        content={<span className={`fa ${isAdd ? 'fa-cancel' : 'fa-add'}`}></span>}
                        onClick={() => setIsAdd(!isAdd)}
                    />
                </div>
            </div>

            {isLoading ? (
                <Loading/>
            ) : isAdd ? (
                <AddProduct/>
            ) : (
                <div className="mt-8 px-5 flex flex-col space-y-8">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductManagerCard
                                key={product.id}
                                product={product}
                            />
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            )}
        </>
    );
}
