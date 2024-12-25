import React from 'react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
}

interface ProductCardProps {
    product: Product;
    onAdd: (product: Product) => void;
    onSub: (product: Product) => void;
}

export default function ProductCard({product, onAdd, onSub}: ProductCardProps) {
    return (
        <div className="flex max-w-[500px] min-h-[100px] w-full bg-white rounded-xl shadow-md p-3 items-center border-[1px]">
            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg mx-1" />
            <div className="w-full mx-1">
                <p className="text-base text-left font-semibold mb-1 mx-1">{product.name}</p>
                <div className="flex">
                    <div className="w-full text-left ml-1">
                        <p className="text-xs">{product.description}</p>
                        <span className="text-orange-500 text-sm font-bold">{product.price.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between items-center w-24">
                        <button
                            className="w-5 h-5 bg-orange-500 text-white rounded-full cursor-pointer flex justify-center items-center text-lg mx-0.5 hover:bg-orange-600"
                            onClick={() => onSub(product)}
                        >
                            <i className="fas fa-minus text-xs" />
                        </button>
                        <div className="w-12 text-center text-sm font-bold">{product.quantity}</div>
                        <button
                            className="w-5 h-5 bg-orange-500 text-white rounded-full cursor-pointer flex justify-center items-center text-lg mx-0.5 hover:bg-orange-600"
                            onClick={() => onAdd(product)}
                        >
                            <i className="fas fa-plus text-xs" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
