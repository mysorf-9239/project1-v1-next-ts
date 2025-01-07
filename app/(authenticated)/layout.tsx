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
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={true}
                draggable={true}
                pauseOnHover={true}
                theme="light"
            />

            <div className={`md:h-screen ${pathname === '/cart' ? 'h-screen' : 'h-[92vh]'} flex`}>
                <div className="min-w-fit h-screen hidden md:block">
                    <Navigation/>
                </div>

                {pathname === '/cart' ? (
                    <div
                        className="relative overflow-y-scroll w-full"
                    >
                        {children}
                    </div>
                ) : (
                    <>
                        <div className="block md:hidden">
                            <MobileNavigation/>
                        </div>

                        <div
                            className="relative overflow-y-scroll w-full p-5 pt-20"
                        >
                            {children}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
