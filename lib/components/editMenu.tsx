import React, {useState} from 'react';
import HandlerError from "@/lib/utils/handlerError";
import {toast} from "react-toastify";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

interface EditMenuProps {
    id: number;
    name: string;
    description: string;
    products: Product[];
    allProducts: Product[];
}

export default function EditMenu({
                                     id,
                                     name: initialName,
                                     description: initialDescription,
                                     products: initialProducts,
                                     allProducts,
                                 }: EditMenuProps) {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [productAdd, setProductAdd] = useState<number[]>(initialProducts.map(p => p.id));

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const handleProductSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProductId(Number(event.target.value));
    };

    const updateProducts = (menuId: number, _name: string, _description: string) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/${menuId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                name: _name,
                description: _description,
            })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }

            return Promise.reject(response);
        }).then((data) => {
            console.log('Updated Menu:', data);
        }).catch(error => HandlerError(error));
    }

    const handleChangeName = () => {
        updateProducts(id, name, initialDescription);
    }

    const handleChangeDescription = () => {
        updateProducts(id, initialName, description);
    }

    const addProduct = (menuId: number, productIds: number[]) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/${menuId}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                productIds,
            }),
        }).then(response => {
            if (response.ok) {
                return response.json();
            }

            return Promise.reject(response);
        }).then((data) => {
            console.log('Updated Menu:', data);
            if (selectedProductId && !productAdd.includes(selectedProductId)) {
                setProductAdd([...productAdd, selectedProductId]);
                setSelectedProductId(null);
            }
        }).catch(error => HandlerError(error));
    }

    const handlerAddProduct = () => {
        if (selectedProductId) {
            const productIds: number[] = [selectedProductId];
            addProduct(id, productIds);
        } else {
            toast.error("Chưa có sản phẩm nào được chọn");
        }
    }

    const removeProduct = (menuId: number, productId: number) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/${menuId}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }).then(response => {
            if (response.ok) {
                return response.json();
            }

            return Promise.reject(response);
        }).then((data) => {
            console.log('Updated Menu:', data);
            setProductAdd(productAdd.filter(id => id !== productId));
        }).catch(error => HandlerError(error));
    }

    const handlerRemoveProduct = (productId: number) => {
        if (productId) {
            removeProduct(id, productId);
        } else {
            toast.error("Sản phẩm không tồn tại");
        }
    }

    return (
        <div className="p-4 border border-gray-300 rounded space-y-4">
            <h2 className="text-xl font-bold">Edit Menu</h2>

            <div>
                <label className="block font-medium">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                />
                <button
                    type="button"
                    onClick={handleChangeName}
                >
                    Change
                </button>
            </div>

            <div>
                <label className="block font-medium">Description</label>
                <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                />
                <button
                    type="button"
                    onClick={handleChangeDescription}
                >
                    Change
                </button>
            </div>

            <div>
                <label className="block font-medium">Select Product</label>
                <div className="flex items-center space-x-2 mt-1">
                    <select
                        value={selectedProductId || ''}
                        onChange={handleProductSelect}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="" disabled>Select a product</option>
                        {allProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={handlerAddProduct}
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
                            const product = allProducts.find((p) => p.id === productId);
                            return (
                                <li key={productId} className="flex justify-between items-center">
                                    <span>{product?.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handlerRemoveProduct(productId)}
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
        </div>
    );
}
