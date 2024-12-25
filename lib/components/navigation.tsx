'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import NavigationItem from './navigationItem';
import {
    Home,
    ShoppingCart,
    FileText,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Grid,
    Package,
    FilePlus,
} from 'lucide-react';
import Image from "next/image";
import {useUser} from "@/lib/hooks/userContext";

export default function Navigation() {
    const router = useRouter();
    const {state, dispatch} = useUser();
    const isAdmin: boolean = state.role === "admin";

    const [isMini, setIsMini] = useState(false);

    const logout = () => {
        dispatch({type: "LOGOUT"});

        router.push('/login');
    };

    return (
        <div
            className={`relative h-screen flex flex-col bg-stone-100 pr-3 transition-all duration-300 group ${
                isMini ? 'w-32' : 'w-72'
            }`}
        >
            <div className="flex justify-start items-center space-x-5">
                <Image src="/logo.png" alt="Logo" className="h-14 w-max my-10 ml-10" width={256} height={256}/>
                {!isMini && <p className="whitespace-nowrap text-2xl font-semibold text-stone-700">Mysorf</p>}
            </div>

            {!isMini ? (
                <button
                    className="absolute right-0 top-10 flex justify-center items-center bg-stone-200 rounded-l-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    onClick={() => setIsMini(true)}
                >
                    <ChevronLeft/>
                </button>
            ) : (
                <button
                    className="absolute -right-6 top-10 flex justify-center items-center bg-stone-200 rounded-r-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    onClick={() => setIsMini(false)}
                >
                    <ChevronRight/>
                </button>
            )}

            <NavigationItem href="/dashboard">
                <Home/>
                {!isMini && <span>Dashboard</span>}
            </NavigationItem>

            <NavigationItem href="/cart">
                <ShoppingCart/>
                {!isMini && <span>Cart</span>}
            </NavigationItem>

            <NavigationItem href="/bill">
                <FileText/>
                {!isMini && <span>Bill</span>}
            </NavigationItem>

            {isAdmin && (
                <>
                    <NavigationItem href="/menu_manager">
                        <Grid />
                        {!isMini && <span className="whitespace-nowrap">Menu Manager</span>}
                    </NavigationItem>

                    <NavigationItem href="/product_manager">
                        <Package />
                        {!isMini && <span className="whitespace-nowrap">Product Manager</span>}
                    </NavigationItem>

                    <NavigationItem href="/bill_manager">
                        <FilePlus />
                        {!isMini && <span className="whitespace-nowrap">Bill Manager</span>}
                    </NavigationItem>
                </>
            )}

            <div className="flex-grow"></div>

            <button
                className="flex items-center justify-center space-x-3 mb-14 hover:text-red-500 font-bold"
                onClick={logout}
            >
                <LogOut/>
                {!isMini && <span>Logout</span>}
            </button>
        </div>
    );
}
