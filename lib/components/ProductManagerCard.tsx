import React, {useState} from 'react';
import HandlerError from "@/lib/utils/handlerError";
import {toast} from "react-toastify";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

export default function ProductManagerCard({product}: { product: Product }) {
    const [loading, setLoading] = useState(false);

    const deleteProduct = () => {
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`, {
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
            className="relative flex w-full min-h-[100px] bg-white rounded-xl shadow-md p-3 items-center border">
            <img
                src={product.image !== "#" ? product.image : "/default-image.png"}
                alt={product.name}
                className="w-12 h-12 rounded-lg mx-5"
            />
            <div className="relative w-full mx-1">
                <p className="text-base text-left font-semibold mb-1 mx-1">{product.name}</p>
                <div className="flex">
                    <div className="w-full text-left ml-1">
                        <p className="text-xs">{product.description}</p>
                        <span className="text-primary-600 text-sm font-bold">{product.price.toLocaleString()} đ</span>
                    </div>

                    <div className="absolute -bottom-3 -right-3">
                        <button
                            type="button"
                            onClick={() => {
                            }}
                            className="w-10 h-10 border border-black rounded-xl bg-lime-100 hover:border-b-4 transition-all duration-300"
                        >
                            <span className="fa fa-edit"></span>
                        </button>
                    </div>

                    <div className="absolute -top-3 -right-3">
                        <button
                            type="button"
                            onClick={deleteProduct}
                            className="w-10 h-10 border border-black rounded-xl bg-red-200 hover:border-b-4 transition-all duration-300"
                        >
                            {loading ? (
                                <span className="fa fa-spinner animate-spin"></span>
                            ) : (
                                <span className="fa fa-trash-can"></span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
