'use client';

import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import Loading from "@/lib/components/Loading";
import {useRouter} from "next/navigation";

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

    // Function to fetch user by token
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
            handleFetchError(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    // Function to handle errors uniformly
    const handleFetchError = (error: Error) => {
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
            handleFetchError(error);
        }).finally(() => {
            setLoading(false);
        });
    }, [router]);

    return (
        <>
            <title>Mysorf | Bill</title>

            <div className="bg-amber-200 p-5 border border-black border-b-2 rounded">Bill</div>

            {loading ? (
                <Loading/>
            ) : (
                <>
                    {bills.length > 0 ? (
                        <div>
                            {bills.map((bill: Bill) => (
                                <div
                                    key={bill.id}
                                    className="border border-gray-300 p-3 mb-3 rounded-md shadow-md"
                                >
                                    <p>
                                        <strong>Bill ID:</strong> {bill.id}
                                    </p>
                                    <p>
                                        <strong>User:</strong> {bill.user?.name || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Amount:</strong> ${bill.amount}
                                    </p>
                                    <p>
                                        <strong>Date:</strong>{' '}
                                        {new Date(bill.createdAt).toLocaleDateString()}
                                    </p>
                                    <div>
                                        <strong>Products:</strong>
                                        {bill.products?.length > 0 ? (
                                            <ul className="list-disc ml-5">
                                                {bill.products.map((product: Product) => (
                                                    <li key={product.id}>
                                                        {product.name} (Qty: {product.BillProducts.quantity})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No products in this bill.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No bills available yet.</p>
                    )}
                </>
            )}
        </>
    );
}
