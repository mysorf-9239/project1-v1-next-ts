import React from 'react';
import ProductCard from './productCard';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
}

interface MenuCardProps {
    title: string;
    products: Product[];
    onAdd: (product: Product) => void;
    onSub: (product: Product) => void;
}

export default function MenuCard({ title, products, onAdd, onSub }: MenuCardProps) {
    return (
        <div className="m-4">
            <div className="text-lg font-medium mb-2 mx-2">{title}</div>
            <div className="flex flex-wrap gap-4 justify-start">
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <ProductCard
                            key={`${product.id}-${index}`}
                            product={product}
                            onAdd={onAdd}
                            onSub={onSub}
                        />
                    ))
                ) : (
                    <p className="mx-auto text-sm">No products match</p>
                )}
            </div>
        </div>
    );
}
