import React, { useState } from 'react';
import ProductMenuCard from "@/lib/components/productMenuCard";
import EditMenu from "@/lib/components/editMenu";

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

export function MenuWithProduct({ title, description, products }: MenuCardProps) {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <p className="text-sm">{description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductMenuCard
                            key={product.id}
                            product={product}
                        />
                    ))
                ) : (
                    <p className="col-span-3">Không có sản phẩm nào trong menu này.</p>
                )}
            </div>
        </div>
    );
}

export function MenuOnly({ id, title, description, products, allProducts }: MenuCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSection = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="mb-8 border rounded-xl p-4">
            <div className="w-1/2">
                <div className="flex h-20 w-full justify-between border border-black bg-lime-200">
                    <div className="flex flex-col items-center justify-center">
                        <p className="whitespace-nowrap text-xl font-semibold">{title}</p>
                        <p className="whitespace-nowrap text-sm">Description: {description}</p>
                        <p className="whitespace-nowrap">Number of products: {products?.length ?? 0}</p>
                    </div>
                    <button
                        onClick={toggleSection}
                        className="border bg-red-500 p-2"
                    >
                        {isOpen ? "Close" : "Open"}
                    </button>
                </div>

                {id !== undefined && products && (
                    <div
                        className={`mx-2 overflow-hidden bg-stone-500 transition-all duration-500 ease-in-out ${
                            isOpen ? "h-auto" : "h-0"
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
        </div>
    );
}
