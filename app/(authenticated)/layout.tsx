'use client';

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {ToastContainer} from "react-toastify";
import Navigation from "@/lib/components/navigation";
import MobileNavigation from "@/lib/components/mobileNavigation";

export default function Layout({children}: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();

    useEffect(() => {
        const accessToken: string | null = localStorage.getItem('accessToken');

        if (!accessToken) {
            router.push('/login');
        }
    }, [router]);

    return (
        <>
            <ToastContainer/>

            <div className="h-screen flex">
                <div className="min-w-fit h-screen hidden md:block">
                    <Navigation/>
                </div>

                <div className="block md:hidden">
                    <MobileNavigation/>
                </div>

                <div className="overflow-y-scroll w-full">
                    {children}
                </div>
            </div>
        </>
    )
}
