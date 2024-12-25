import React from 'react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartCardProps {
    product: Product;
    onAdd: (product: Product) => void;
    onSub: (product: Product) => void;
    onRemove: (product: Product) => void;
}

const CartCard: React.FC<CartCardProps> = ({ product, onAdd, onSub, onRemove }) => {
    return (
        <div className="relative flex w-full min-h-[100px] bg-white rounded-xl shadow-md p-3 items-center border-[1px]">
            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg mx-1"/>
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
                            <i className="fa fa-minus text-xs"/>
                        </button>
                        <span>{product.quantity}</span>
                        <button
                            className="w-5 h-5 bg-orange-500 text-white rounded-full cursor-pointer flex justify-center items-center text-lg mx-0.5 hover:bg-orange-600"
                            onClick={() => onAdd(product)}
                        >
                            <i className="fa fa-plus text-xs"/>
                        </button>
                    </div>
                </div>

                <div className="absolute top-0 right-0">
                    <div className="relative w-10 h-10">
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-orange-500 border-l-[40px] border-l-transparent rounded-tr-md"/>
                        <button
                            className="absolute top-0 right-0 text-white w-7 h-7 flex items-center justify-center cursor-pointer"
                            onClick={() => onRemove(product)}
                        >
                            <i className="fa fa-times text-sm"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartCard;
