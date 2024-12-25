import React, {useState} from "react";
import {toast} from "react-toastify";
import HandlerError from "@/lib/utils/handlerError";

interface BillProducts {
    quantity: number;
}

interface Product {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    BillProducts: BillProducts;
}

interface User {
    name: string;
    email: string;
}

interface Bill {
    id: number;
    amount: number;
    createdAt: string;
    user: User;
    products: Product[];
}

interface BillCardProps {
    bill: Bill;
}

const BillCard: React.FC<BillCardProps> = ({ bill }) => {
    const [loading, setLoading] = useState(false);

    const deleteBill = () => {
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/bills/${bill.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        }).then((data) => {
            toast.success(data.message);
        }).catch((error) => {
            HandlerError(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div
            className="relative flex flex-col justify-start space-y-1 w-full h-60 border shadow-md p-5 mb-3 rounded-xl">
            <p className="flex justify-center items-center whitespace-nowrap font-semibold fa">Id: {bill.id}</p>
            <p className="whitespace-nowrap font-semibold">User: {bill.user?.name || 'N/A'}</p>
            <p className="whitespace-nowrap font-semibold">Total amount: {bill.amount} đ</p>
            <p className="whitespace-nowrap font-semibold">Date: {new Date(bill.createdAt).toLocaleDateString()}</p>

            <div className="absolute top-0 right-1">
                <button
                    type="button"
                    onClick={deleteBill}
                    className="w-10 h-10 border border-black rounded-xl bg-red-200 hover:border-b-4 transition-all duration-300"
                >
                    {loading ? (
                        <span className="fa fa-spinner animate-spin"></span>
                    ): (
                        <span className="fa fa-trash-can"></span>
                    )}
                </button>
            </div>

            <div className="space-y-2">
                <p className="font-semibold">Products: {bill.products.length}</p>
                {bill.products?.length > 0 ? (
                    <div className="flex flex-col space-y-1 h-20 overflow-y-scroll px-2">
                        {bill.products.map((product) => (
                            <div
                                key={product.id}
                                className="flex justify-around border rounded-lg p-1 px-3 bg-white shadow-md"
                            >
                                <p className="whitespace-nowrap">Name: {product.name}</p>
                                <div className="flex-grow"></div>
                                <p className="whitespace-nowrap">Quantity: {product.BillProducts.quantity}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No products in this bill.</p>
                )}
            </div>
        </div>
    );
};

export default BillCard;
