'use client';

import React, {useEffect, useState} from "react";
import Loading from "@/lib/components/Loading";
import {useRouter} from "next/navigation";
import BillCard from "@/lib/components/BillCard";
import HandlerError from "@/lib/utils/handlerError";
import SearchHeader from "@/lib/components/searchHeader";
import EmptyContent from "@/lib/components/emptyContent";

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

    const getUserId = (token: string) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/id`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (!response.ok) {
                return Promise.reject(response);
            }

            return response.json();
        }).then((data: User) => {
            console.log(data);
            setBills(prevBills =>
                prevBills.map(bill => ({
                    ...bill,
                    user: {
                        name: data.name,
                        email: data.email,
                    },
                }))
            );
        }).catch(error => {
            HandlerError(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const filteredBills = bills.filter((bill) =>
        bill.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.products.some((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    useEffect(() => {
        const token: string | undefined = localStorage.getItem("accessToken") || undefined;
        setLoading(true);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/bills/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token && {Authorization: `Bearer ${token}`}),
            },
        }).then((response) => {
            if (!response.ok) {
                return Promise.reject(response);
            }

            return response.json();
        }).then((data: Bill[]) => {
            setBills(data);

            if (token) {
                getUserId(token);
            }
        }).catch(error => {
            HandlerError(error);
        }).finally(() => {
            setLoading(false);
        });
    }, [router]);

    return (
        <>
            <title>Mysorf | Bill</title>

            <SearchHeader
                title="Bill"
                holder="Search with user name"
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
                        <EmptyContent
                            title="No bills found"
                            description="Try searching with different name."
                        />
                    )}
                </div>
            )}
        </>
    );
}
