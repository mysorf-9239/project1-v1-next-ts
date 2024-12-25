import React, {useState} from 'react';
import {toast} from 'react-toastify';

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
        }).catch((error) => handleError(error));
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
        }).catch((error) => handleError(error));
    };

    const handleError = (error: Error) => {
        if (error instanceof Response) {
            error.json().then((data) => {
                toast.error(data.message || 'An error occurred', {
                    position: 'top-right',
                    autoClose: 5000,
                });
            });
        } else {
            toast.error('Server Error', {
                position: 'top-right',
                autoClose: 5000,
            });
        }
    };

    return (
        <div className="mt-4 p-4 border border-gray-300 rounded space-y-4">
            <h2 className="text-xl font-bold">Add Menu</h2>

            <div>
                <label className="block font-medium">Name</label>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </div>

            <div>
                <label className="block font-medium">Description</label>
                <textarea
                    name="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </div>

            <div>
                <label className="block font-medium">Select Product</label>
                <div className="flex items-center space-x-2 mt-1">
                    <select
                        value={selectedProductId || ''}
                        onChange={handleProductSelect}
                        className="w-full p-2 border border-gray-300 rounded"
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
                    <button
                        onClick={handleAddProduct}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div>
                <h3 className="font-medium mt-4">Selected Products:</h3>
                {productAdd.length > 0 ? (
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                        {productAdd.map((productId) => {
                            const product = products.find((p) => p.id === productId);
                            return (
                                <li key={productId} className="flex justify-between items-center">
                                    <span>{product?.name}</span>
                                    <button
                                        onClick={() => handleRemoveProduct(productId)}
                                        className="text-red-500"
                                    >
                                        Remove
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-500 mt-2">No products added yet.</p>
                )}
            </div>

            <button
                onClick={createEmptyMenu}
                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            >
                Save Menu
            </button>
        </div>
    );
}
