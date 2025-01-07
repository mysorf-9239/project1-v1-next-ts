import React, {useState} from 'react';
import {encodeImageToBase64} from '@/lib/components/imageHandler';
import {toast} from 'react-toastify';
import HandlerError from "@/lib/utils/handlerError";
import SubmitButton from "@/lib/components/submitButton";
import formatNumber from '@/lib/utils/formatNumber';
import Image from "next/image";

export default function AddProduct() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('Nothing');
    const [price, setPrice] = useState('0');
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(event.target.value);
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const base64 = await encodeImageToBase64(file);
                setImageBase64(base64);
            } catch (error) {
                console.error(error);
                toast.error('Failed to process image.');
            }
        }
    };

    const createProduct = () => {
        const productData: {
            name: string;
            description: string;
            price: number;
            image?: string;
        } = {
            name,
            description,
            price: parseFloat(price),
        };

        if (imageBase64) {
            productData.image = imageBase64;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(productData),
        }).then((response) => {
            if (response.ok) return response.json();
            return Promise.reject(response);
        }).then((data) => {
            console.log(data);
            toast.success('Product created successfully!', {
                position: 'top-right',
                autoClose: 5000,
            });
        }).catch((error) => HandlerError(error));
    };

    return (
        <div className="mt-8 border shadow-md space-y-4 p-5 mx-5 rounded-2xl">
            <h2 className="text-center text-2xl font-semibold">Add Product</h2>

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
                <label className="block font-medium w-32">Price</label>
                <input
                    type="number"
                    name="price"
                    value={price}
                    onChange={handlePriceChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none"
                />
            </div>

            <div className="flex justify-center items-center space-x-4">
                <label className="block font-medium whitespace-nowrap w-32">Upload Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none"
                />
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-center p-5">Preview</h2>
                <div className="relative border p-4 rounded-3xl flex justify-center items-center space-x-5">
                    <div className="min-w-24 min-h-24 border rounded-xl overflow-hidden">
                        <Image
                            src={imageBase64 ? imageBase64 : "/default-image.png"}
                            alt={name}
                            className="w-full h-full rounded-xl object-cover"
                            width={96}
                            height={96}
                        />
                    </div>

                    <div className="relative w-full overflow-y-auto">
                        <h2 className="text-xl font-bold mb-2 text-center">{name}</h2>
                        <p className="text-gray-600 mb-4 pl-5 whitespace-nowrap">Price: {formatNumber(parseFloat(price))} đ</p>
                        <p className="text-gray-600 pl-5 whitespace-nowrap">Description: {description}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center">
                <SubmitButton
                    content={<span className="fa fa-save"> Create Product</span>}
                    onClick={createProduct}
                />
            </div>
        </div>
    );
}
