import React, {useState} from 'react';
import HandlerError from "@/lib/utils/handlerError";
import {toast} from "react-toastify";
import SubmitButton from "@/lib/components/submitButton";
import EmptyContent from "@/lib/components/emptyContent";

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
        <div className="p-4 space-y-4">
            <div className="flex justify-center items-center space-x-4">
                <label className="block font-medium w-32">Name: </label>
                <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none"
                />
                <SubmitButton
                    content="Change"
                    onClick={handleChangeName}
                />
            </div>

            <div className="flex justify-center items-center space-x-4">
                <label className="block font-medium w-32">Description: </label>
                <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none"
                />
                <SubmitButton
                    content="Change"
                    onClick={handleChangeDescription}
                />
            </div>

            <div className="flex justify-center items-center space-x-4">
                <label className="block font-medium w-32">Add Product: </label>
                <div className="flex w-full items-center space-x-2">
                    <select
                        value={selectedProductId || ''}
                        onChange={handleProductSelect}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                    >
                        <option value="" disabled>Select a product</option>
                        {allProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    <SubmitButton
                        content="Add"
                        onClick={handlerAddProduct}
                    />
                </div>
            </div>

            <div className="flex flex-col w-full justify-center items-start h-36">
                <h3 className="font-medium">Selected Products:</h3>
                {productAdd.length > 0 ? (
                    <div className="flex flex-col w-full py-2 px-5 overflow-y-scroll h-32 space-y-2">
                        {productAdd.map((productId) => {
                            const product = allProducts.find((p) => p.id === productId);
                            return (
                                <div key={productId}
                                     className="flex justify-center p-2 rounded-md items-center border border-stone-400 shadow-md">
                                    <div className="flex-grow w-10"></div>
                                    <p className="whitespace-nowrap">Product name: {product?.name}</p>
                                    <div className="flex-grow"></div>

                                    <button
                                        type="button"
                                        onClick={() => handlerRemoveProduct(productId)}
                                        className="px-2 py-1 bg-lime-200 border border-black rounded-xl hover:border-b-4 transition-all duration-300 font-semibold"
                                    >
                                        <span className="fa fa-trash-alt"></span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyContent
                        title="No products added"
                        description="Try selecting a product from the list above."
                    />
                )}
            </div>
        </div>
    );
}
