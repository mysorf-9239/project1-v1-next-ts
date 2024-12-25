import React, {useState} from 'react';
import ProductMenuCard from "@/lib/components/productMenuCard";
import EditMenu from "@/lib/components/editMenu";
import {toast} from "react-toastify";
import HandlerError from "@/lib/utils/handlerError";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

interface MenuCardProps {
    id?: number;
    title: string;
    description: string;
    products: Product[];
    allProducts?: Product[];
}

export function MenuWithProduct({title, description, products}: MenuCardProps) {
    return (
        <div>
            <div className="text-lg font-medium mb-2 mx-2">{title}</div>
            <p className="hidden">{description}</p>
            <div className="flex flex-wrap gap-4 justify-start">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductMenuCard
                            key={product.id}
                            product={product}
                        />
                    ))
                ) : (
                    <p className="mx-auto text-sm">Không có sản phẩm nào phù hợp</p>
                )}
            </div>
        </div>
    );
}

export function MenuOnly({id, title, description, products, allProducts}: MenuCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const deleteMenu = () => {
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/${id}`, {
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

    const toggleSection = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div
            className="relative flex flex-col w-full min-h-[100px] bg-white rounded-xl shadow-md p-3 items-center border my-8">
            <div className="relative w-full mx-1">
                <p className="whitespace-nowra text-xl text-center font-semibold mb-1 mx-1">{title}</p>
                <div className="flex">
                    <div className="w-full text-left ml-1">
                        <p className="whitespace-nowra text-xs">Description: {description}</p>
                        <span
                            className="whitespace-nowra text-primary-600 text-sm font-bold">Number of products: {products?.length ?? 0}</span>
                    </div>

                    <div className="absolute -top-2 -right-2">
                        <button
                            type="button"
                            onClick={deleteMenu}
                            className="w-10 h-10 border border-black rounded-xl bg-red-200 hover:border-b-4 transition-all duration-300"
                        >
                            {loading ? (
                                <span className="fa fa-spinner animate-spin"></span>
                            ): (
                                <span className="fa fa-trash-can"></span>
                            )}
                        </button>
                    </div>

                    <div className="absolute -bottom-3 -right-2">
                        <button
                            type="button"
                            onClick={toggleSection}
                            className="w-10 h-10 border border-black rounded-xl bg-lime-100 hover:border-b-4 transition-all duration-300"
                        >
                            <span className={`fa ${isOpen ? 'fa-close' : 'fa-edit'}`}></span>
                        </button>
                    </div>
                </div>
            </div>

            {id !== undefined && products && (
                <div
                    className={`mx-2 w-full overflow-hidden rounded-b-2xl bg-stone-100 transition-all duration-500 ease-in-out ${
                        isOpen ? "h-96 mt-5" : "h-0"
                    }`}
                >
                    <EditMenu
                        id={id}
                        name={title}
                        description={description}
                        products={products}
                        allProducts={allProducts || []}
                    />
                </div>
            )}
        </div>
    );
}
