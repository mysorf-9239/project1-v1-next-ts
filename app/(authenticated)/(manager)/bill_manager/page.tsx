'use client';

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import HandlerError from "@/lib/utils/handlerError";
import Loading from "@/lib/components/Loading";
import BillCard from "@/lib/components/BillCard";
import SearchHeader from "@/lib/components/searchHeader";

interface BillProducts {
    quantity: number;
}

interface Product {
    id: number,
    name: string,
    description: string,
    image: string,
    price: number,
    BillProducts: BillProducts,
}

interface User {
    name: string,
    email: string,
}

interface Bill {
    id: number,
    device_id: number,
    amount: number,
    createdAt: string,
    updatedAt: string,
    user_id: number,
    user: User,
    products: Product[],
}

export default function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [bills, setBills] = useState<Bill[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredBills = bills.filter((bill) =>
        bill.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.products.some((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    useEffect(() => {
        setLoading(true);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/bills`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }).then((response) => {
            if (!response.ok) {
                return Promise.reject(response);
            }

            return response.json();
        }).then((data: Bill[]) => {
            setBills(data);
            setLoading(false);
        }).catch(error => {
            HandlerError(error);
        }).finally(() => {
            setLoading(false);
        });
    }, [router]);

    return (
        <>
            <title>Mysorf | Bill Management</title>

            <SearchHeader
                title="Bill Manager"
                holder="Enter user name"
                onSearchChange={(e) => setSearchQuery(e.target.value)}
            />

            {loading ? (
                <Loading/>
            ) : (
                <div className="p-5 pt-8">
                    {filteredBills.length > 0 ? (
                        <div className="flex flex-wrap gap-5 justify-start">
                            {filteredBills.map((bill) => (
                                <BillCard
                                    key={bill.id}
                                    bill={bill}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>No matching bills found.</p>
                    )}
                </div>
            )}
        </>
    )
}