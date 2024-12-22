'use client';

import React from "react";

export default function Page() {
    const [email, setEmail] = React.useState('');

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        alert('Coming Soon!');
    }

    return (
        <>
            <title>Mysorf | Forgot Password</title>

            <div className="w-full md:min-w-96 p-5 space-y-6">
                <div className="w-fit md:text-5xl text-3xl font-semibold mb-20 bg-primary-100 p-2 rounded-xl">
                    Forgot Password
                </div>

                <div className="font-semibold text-lg">Enter your email</div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="border border-black flex items-center bg-stone-100 rounded-xl overflow-hidden px-3">
                        <svg viewBox="0 0 24 25" fill="none" focusable="false" className="h-6 w-6">
                            <path d="M17 21.3H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5z"
                                  stroke="currentColor"
                                  strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                  strokeLinejoin="round"></path>
                            <path d="M17 9.8l-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9.8" stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>

                        <input type="email" className="bg-stone-100 w-full p-3 focus:outline-none" placeholder="Email"
                               value={email}
                               onChange={handleEmailChange}/>
                    </div>

                    <div>
                        <p className="text-stone-500 text-sm font-light">We will send a recovery link to this email</p>
                    </div>

                    <button type="submit"
                            className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition">
                        SEND RECOVERY LINK
                    </button>
                </form>
            </div>
        </>
    )
}