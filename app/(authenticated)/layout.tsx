'use client';

import React, {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import {ToastContainer} from "react-toastify";
import Navigation from "@/lib/components/navigation";
import MobileNavigation from "@/lib/components/mobileNavigation";

export default function Layout({children}: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const accessToken: string | null = localStorage.getItem('accessToken');

        if (!accessToken) {
            router.push('/login');
        }
    }, [router]);

    return (
        <>
            <ToastContainer/>

            <div className="md:h-screen h-[92vh] flex">
                <div className="min-w-fit h-screen hidden md:block">
                    <Navigation/>
                </div>

                <div className="block md:hidden">
                    <MobileNavigation/>
                </div>

                <div
                    className={`relative overflow-y-scroll w-full ${
                        pathname === '/cart' ? 'p-0' : 'p-5 pt-20'
                    }`}
                >
                    {children}
                </div>
            </div>
        </>
    )
}
