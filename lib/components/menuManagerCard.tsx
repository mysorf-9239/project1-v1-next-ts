import React from 'react';
import ProductMenuCard from "@/lib/components/productMenuCard";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

interface MenuCardProps {
    title: string;
    products: Product[];
}

export default function MenuManagerCard({title, products}: MenuCardProps) {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
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

