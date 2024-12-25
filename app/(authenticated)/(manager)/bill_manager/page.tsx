'use client';

import React, {useState} from "react";

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSection = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <title>Mysorf | Bill Management</title>

            <div className="bg-amber-200 p-5 border border-black border-b-2 rounded">Cart</div>

            <div className="w-1/2">
                <div className="flex h-20 w-full justify-between border border-black bg-lime-200">
                    <div className="flex flex-col items-center justify-center">
                        <p>Line 1</p>
                        <p>Line 2</p>
                    </div>
                    <button
                        onClick={toggleSection}
                        className="border bg-red-500 p-2"
                    >
                        {isOpen ? "Close" : "Open"}
                    </button>
                </div>

                <div
                    className={`mx-2 overflow-hidden bg-stone-500 transition-all duration-500 ease-in-out ${isOpen ? "h-10" : "h-0"}`}
                >
                    <p className="text-center">Line 3</p>
                </div>
            </div>
        </>
    )
}