'use client';

import React from "react";
import Link from "next/link";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {useUser} from "@/lib/hooks/userContext";

export default function Page() {
    const router = useRouter();
    const { dispatch } = useUser();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const login = async (event: React.FormEvent) => {
        event.preventDefault();

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }

            return Promise.reject(response);
        }).then((data) => {
            localStorage.setItem('accessToken', data.token);

            dispatch({
                type: "LOGIN",
                payload: {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role,
                }
            });

            router.push('/dashboard');
        }).catch(error => {
            if (error instanceof Response) {
                error.json().then((data) => {
                    toast.error(
                        <div className="text-black space-y-2 px-3">
                            <p>{data.message}</p>
                        </div>, {
                            position: "top-right",
                            autoClose: 5_000,
                            hideProgressBar: true,
                            className: "bg-red-100 border border-black rounded-xl w-full shadow-[0px_5px_0px_0px_#191A23]",
                            closeButton: false
                        });
                })
            } else {
                toast.error(
                    <div className="text-black space-y-2 px-3">
                        <p>Server Error</p>
                    </div>, {
                        position: "top-right",
                        autoClose: 5_000,
                        hideProgressBar: true,
                        className: "bg-red-100 border border-black rounded-xl w-full shadow-[0px_5px_0px_0px_#191A23]",
                        closeButton: false
                    });
            }
        });
    }

    return (
        <>
            <title>Mysorf | Login</title>

            <div className="w-full md:min-w-96 p-5 space-y-6 mt-16 md:mt-0">
                <div className="w-fit md:text-5xl text-3xl font-semibold mb-20 bg-lime-100 p-2 rounded-xl">Login
                </div>

                <div className="flex items-center">
                    <div className="font-semibold text-sm md:text-base">Don&#39;t have an account?</div>

                    <div className="flex-grow"></div>

                    <Link href={"/register"}
                          className="bg-lime-300 font-semibold md:text-base text-sm underline px-3 py-1 rounded-lg">
                        Register
                    </Link>
                </div>

                <form className="space-y-4" onSubmit={login}>
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

                    <div className="border border-black flex items-center bg-stone-100 rounded-xl overflow-hidden px-3">
                        <svg viewBox="0 0 24 25" fill="none" focusable="false" className="h-6 w-6">
                            <path d="M16.423 10.249V8.102a4.552 4.552 0 00-4.55-4.551 4.55 4.55 0 00-4.57 4.53v2.168"
                                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                  strokeLinejoin="round"></path>
                            <path clipRule="evenodd"
                                  d="M15.683 22.05h-7.64a3.792 3.792 0 01-3.793-3.792V13.97a3.792 3.792 0 013.792-3.792h7.641a3.792 3.792 0 013.792 3.792v4.29a3.792 3.792 0 01-3.792 3.791z"
                                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                  strokeLinejoin="round"></path>
                            <path d="M11.863 15.004v2.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                  strokeLinejoin="round"></path>
                        </svg>

                        <input type="password" className="bg-stone-100 w-full p-3 focus:outline-none"
                               placeholder="Password"
                               value={password} onChange={handlePasswordChange}/>
                    </div>

                    <div>
                        <Link href={"/forgot-password"}
                              className="text-stone-500 hover:underline font-light text-sm md:texr-base">
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit"
                            className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition">
                        Login
                    </button>
                </form>
            </div>
        </>
    )
}