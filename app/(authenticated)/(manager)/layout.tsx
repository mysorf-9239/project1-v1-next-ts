'use client';

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useUser} from "@/lib/hooks/userContext";

export default function Layout({children}: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const {state} = useUser();

    useEffect(() => {
        if (state.role && state.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [state.role, router]);

    return (
        <>
            {children}
        </>
    )
}