import React, {useState} from 'react';
import {toast} from 'react-toastify';
import HandlerError from "@/lib/utils/handlerError";
import SubmitButton from "@/lib/components/submitButton";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

interface AddMenuProps {
    products: Product[];
}

export default function AddMenu({products}: AddMenuProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [productAdd, setProductAdd] = useState<number[]>([]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const handleProductSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProductId(Number(event.target.value));
    };

    const handleAddProduct = () => {
        if (selectedProductId && !productAdd.includes(selectedProductId)) {
            setProductAdd([...productAdd, selectedProductId]);
        }
    };

    const handleRemoveProduct = (id: number) => {
        setProductAdd(productAdd.filter((productId) => productId !== id));
    };

    const addProductToCart = (menuId: number, productIds: number[]) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/${menuId}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                productIds,
            }),
        }).then((response) => {
            if (response.ok) return response.json();
            return Promise.reject(response);
        }).then(() => {
            toast.success('Menu created and products added successfully!', {
                position: 'top-right',
                autoClose: 5000,
            });
        }).catch((error) => HandlerError(error));
    };

    const createEmptyMenu = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                name,
                description,
            }),
        }).then((response) => {
            if (response.ok) return response.json();
            return Promise.reject(response);
        }).then((data) => {
            console.log(data);
            console.log(productAdd);
            if (productAdd.length > 0) {
                addProductToCart(data.id, productAdd);
            } else {
                toast.success("Create menu successfully");
            }
        }).catch((error) => HandlerError(error));
    };

    return (
        <div className="mt-8 bg-white border shadow-md space-y-4 p-5 mx-5 rounded-2xl">
            <h2 className="text-center text-2xl font-semibold">Add Menu</h2>

            <div className="flex justify-center items-center space-x-4">
                <label className="block font-medium w-32">Name</label>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none"
                />
            </div>

            <div className="flex justify-center items-center space-x-4">
                <label className="block font-medium w-32">Description</label>
                <textarea
                    name="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none"
                />
            </div>

            <div className="flex justify-center items-center space-x-4">
                <label className="block font-medium whitespace-nowrap w-32">Select Product</label>
                <div className="flex w-full items-center space-x-2 mt-1">
                    <select
                        value={selectedProductId || ''}
                        onChange={handleProductSelect}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                    >
                        <option value="" disabled>
                            Select a product
                        </option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    <SubmitButton
                        content="Add"
                        onClick={handleAddProduct}
                    />
                </div>
            </div>

            <div>
                <h3 className="font-medium mt-4">Selected Products:</h3>
                {productAdd.length > 0 ? (
                    <div className="mt-2">
                        {productAdd.map((productId) => {
                            const product = products.find((p) => p.id === productId);
                            return (
                                <div key={productId}
                                     className="flex justify-center p-2 rounded-md items-center border border-gray-400">
                                    <div className="flex-grow w-10"></div>
                                    <p className="whitespace-nowrap">Product name: {product?.name}</p>
                                    <div className="flex-grow"></div>
                                    <SubmitButton
                                        content={<span className="fa fa-trash-alt"></span>}
                                        onClick={() => handleRemoveProduct(productId)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 mt-2">No products added yet.</p>
                )}
            </div>

            <div className="flex justify-center items-center">
                <SubmitButton
                    content={<span className="fa fa-save"> Create Menu</span>}
                    onClick={createEmptyMenu}
                />
            </div>
        </div>
    );
}
