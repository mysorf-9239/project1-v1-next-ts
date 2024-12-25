import React from 'react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

export default function ProductMenuCard({ product }: { product: Product }) {
    return (
        <div className="flex max-w-[500px] min-h-[100px] w-full bg-white rounded-xl shadow-md p-3 items-center border">
            <img
                src={product.image !== "#" ? product.image : "/default-image.png"}
                alt={product.name}
                className="w-12 h-12 rounded-lg mx-1"
            />
            <div className="w-full mx-1">
                <p className="text-base text-left font-semibold mb-1 mx-1">{product.name}</p>
                <div className="flex">
                    <div className="w-full text-left ml-1">
                        <p className="text-xs">{product.description}</p>
                        <span className="text-primary-600 text-sm font-bold">{product.price.toLocaleString()} đ</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
