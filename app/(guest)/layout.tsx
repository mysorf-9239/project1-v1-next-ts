'use client';

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {ToastContainer} from "react-toastify";

export default function Layout({children}: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            router.push('/dashboard');
        }
    });

    return (
        <>
            <ToastContainer/>

            <div className="h-screen flex">
                <div className="md:p-10 md:pt-0 w-full md:min-w-fit md:w-1/3 h-screen overflow-y-scroll">
                    {children}
                </div>

                <div className="hidden md:block h-screen w-full bg-[url('/guest-bg.jpg')] bg-cover bg-center"></div>
            </div>
        </>
    )
}