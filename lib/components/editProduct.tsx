import React, {useState} from 'react';
import SubmitButton from "@/lib/components/submitButton";
import {encodeImageToBase64} from "@/lib/components/imageHandler";
import {toast} from "react-toastify";
import HandlerError from "@/lib/utils/handlerError";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

export default function EditProduct({initProduct}: { initProduct: Product }) {
    const [image, setImage] = useState(initProduct.image);
    const [name, setName] = useState(initProduct.name);
    const [description, setDescription] = useState(initProduct.description);
    const [price, setPrice] = useState(initProduct.price);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const base64 = await encodeImageToBase64(file);
                setImage(base64);
            } catch (error) {
                console.error('Failed to encode image:', error);
                toast.error('Failed to process image.');
            }
        }
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(parseFloat(event.target.value));
    };

    const updateProduct = (productId: number, _image: string, _name: string, _description: string, _price: number) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                image: _image,
                name: _name,
                description: _description,
                price: _price,
            })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }

            return Promise.reject(response);
        }).then(data => {
            console.log(data);
        }).catch(error => HandlerError(error));
    }

    const handleChangeImage = () => {
        if (image !== initProduct.image) {
            updateProduct(initProduct.id, image, initProduct.name, initProduct.description, initProduct.price);
        }
    };

    const handleChangeName = () => {
        if (name !== initProduct.name) {
            updateProduct(initProduct.id, initProduct.image, name, initProduct.description, initProduct.price);
        }
    };

    const handleChangeDescription = () => {
        if (description !== initProduct.description) {
            updateProduct(initProduct.id, initProduct.image, initProduct.name, description, initProduct.price);
        }
    };

    const handleChangePrice = () => {
        if (price !== initProduct.price) {
            updateProduct(initProduct.id, initProduct.image, initProduct.name, initProduct.description, price);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-start items-center">
                <label className="block font-medium w-32">Image: </label>
                <div className="flex items-center justify-between mx-4 w-full">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="p-1 border border-gray-300 rounded"
                    />
                    <img
                        src={image !== "#" ? image : "/default-image.png"}
                        alt={name}
                        className="w-12 h-12 rounded-xl object-cover mx-5"
                    />
                </div>
                <SubmitButton
                    content="Change"
                    onClick={handleChangeImage}
                />
            </div>

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
                <label className="block font-medium w-32">Price: </label>
                <input
                    type="number"
                    value={price}
                    onChange={handlePriceChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none"
                />
                <SubmitButton
                    content="Change"
                    onClick={handleChangePrice}
                />
            </div>
        </div>
    );
}
