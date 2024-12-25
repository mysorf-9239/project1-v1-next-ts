'use client';

import React, {useEffect, useState} from "react";
import Loading from "@/lib/components/Loading";
import {useRouter} from "next/navigation";
import BillCard from "@/lib/components/BillCard";
import HandlerError from "@/lib/utils/handlerError";

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

            <div className="bg-amber-200 p-5 border border-black border-b-2 rounded">Bill</div>

            {loading ? (
                <Loading />
            ) : (
                <div className="p-5 pt-8">
                    {bills.length > 0 ? (
                        <div className="flex flex-wrap gap-5 justify-start">
                            {bills.map((bill) => (
                                <BillCard key={bill.id} bill={bill}/>
                            ))}
                        </div>
                    ) : (
                        <p>No bills available yet.</p>
                    )}
                </div>
            )}
        </>
    );
}
