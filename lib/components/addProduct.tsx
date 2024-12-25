import React, {useState} from 'react'
import {encodeImageToBase64} from "@/lib/components/imageHandler";

export default function AddProduct() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageBase64, setImageBase64] = useState('');

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    }

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(event.target.value);
    }

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const base64 = await encodeImageToBase64(file);
                setImageBase64(base64);
            } catch (error) {
                console.error('Failed to encode image:', error);
            }
        }
    }

    return (
        <div className="mt-4 p-4 border border-gray-300 rounded space-y-4">
            <h2 className="text-xl font-bold">Add Product</h2>

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
                <label className="block font-medium">Price</label>
                <input
                    type="number"
                    name="price"
                    value={price}
                    onChange={handlePriceChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </div>

            <div>
                <label className="block font-medium">Upload Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-2"
                />
            </div>

            <div className="mt-4">
                <h3 className="font-medium">Preview:</h3>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Description:</strong> {description}</p>
                <p><strong>Price:</strong> ${price}</p>
                {imageBase64 && (
                    <img
                        src={imageBase64}
                        alt="Preview"
                        className="mt-2 w-32 h-32 object-cover border border-gray-300 rounded"
                    />
                )}
            </div>
        </div>
    );
}