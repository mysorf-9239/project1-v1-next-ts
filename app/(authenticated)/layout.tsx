'use client';

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import Modal from 'react-modal';
import {ToastContainer} from "react-toastify";
import Navigation from "@/lib/components/navigation";
import MobileNavigation from "@/lib/components/mobileNavigation";

Modal.setAppElement('body');

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
                <div className="min-w-fit w-1/5 h-screen hidden md:block">
                    <Navigation/>
                </div>

                <div className="block md:hidden">
                    <MobileNavigation/>
                </div>

                <div className="p-5 md:p-10 mb-20 md:mb-0 mt-20 md:mt-0 overflow-y-scroll w-full">
                    {children}
                </div>
            </div>
        </>
    )
}
