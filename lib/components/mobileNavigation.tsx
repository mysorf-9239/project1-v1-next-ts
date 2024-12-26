import MobileNavigationItem from "@/lib/components/mobileNavigationItem";
import {
    Home,
    ShoppingCart,
    FileText,
    ChartNoAxesGantt,
    Grid,
    Package,
    FilePlus,
    LogOut,
} from 'lucide-react';
import {useUser} from "@/lib/hooks/userContext";
import React from "react";
import {useRouter} from "next/navigation";

export default function MobileNavigation() {
    const router = useRouter();
    const {state, dispatch} = useUser();
    const isAdmin: boolean = state.role === "admin";

    const logout = () => {
        dispatch({type: "LOGOUT"});
        router.push('/login');
    };

    return (
        <>
            <div
                className="fixed bottom-0 border-t border-black w-full h-20 rounded-t-3xl grid grid-cols-4 p-3 bg-stone-100 z-20">
                <MobileNavigationItem href="/cart">
                    <ShoppingCart/>
                </MobileNavigationItem>

                <MobileNavigationItem href="/dashboard">
                    <Home/>
                </MobileNavigationItem>

                <MobileNavigationItem href="/bill">
                    <FileText/>
                </MobileNavigationItem>

                {isAdmin ? (
                    <div className="relative flex items-center justify-center group">
                        <div
                            className="p-3 cursor-pointer group-hover:bg-lime-100 group-hover:border border-black rounded-xl"
                        >
                            <ChartNoAxesGantt/>
                        </div>

                        <div
                            className="absolute hidden group-hover:flex group-focus:flex flex-col-reverse justify-center items-center border border-stone-300 bg-lime-100 rounded-xl -top-60 bottom-14 left-8 right-8 space-y-2">
                            <div
                                className="cursor-pointer rounded-xl border border-lime-100 hover:border-stone-300 hover:bg-lime-200">
                                <div className="p-3">
                                    <LogOut/>
                                </div>
                            </div>
                            <div
                                className="cursor-pointer rounded-xl border border-lime-100 hover:border-stone-300 hover:bg-lime-200">
                                <MobileNavigationItem href="/menu_manager">
                                    <Grid/>
                                </MobileNavigationItem>
                            </div>
                            <div
                                className="cursor-pointer rounded-xl border border-lime-100 hover:border-stone-300 hover:bg-lime-200">
                                <MobileNavigationItem href="/product_manager">
                                    <Package/>
                                </MobileNavigationItem>
                            </div>
                            <div
                                className="cursor-pointer rounded-xl border border-lime-100 hover:border-stone-300 hover:bg-lime-200">
                                <MobileNavigationItem href="/bill_manager">
                                    <FilePlus/>
                                </MobileNavigationItem>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <button
                            className="flex items-center justify-center space-x-3 mb-14 hover:text-red-500 font-bold"
                            onClick={logout}
                        >
                            <div className="p-3">
                                <LogOut/>
                            </div>
                        </button>
                    </>
                )}
            </div>
        </>
    )
}
