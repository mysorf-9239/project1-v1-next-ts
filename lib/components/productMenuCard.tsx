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
        <div className="border p-4 rounded-3xl relative flex">
            <div className="w-1/4 border-2 rounded-2xl">
                <img
                    src={product.image || "/default-image.jpg"}
                    alt={product.name}
                    className="w-full h-auto rounded-xl object-cover"
                />
            </div>

            <div className="w-3/4">
                <h2 className="text-xl font-bold mb-2 text-center">{product.name}</h2>
                <p className="text-gray-600 mb-4 pl-5">Giá: {product.price}</p>
                <p className="text-gray-600 pl-5">{product.description}</p>
            </div>
        </div>
    );
}
