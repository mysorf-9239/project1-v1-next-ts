'use client';

import React from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";

const MobileNavigationItem: React.FC<{ href: string, children: React.ReactNode }> = ({href, children}) => {
    const pathname: string = usePathname();

    return (
        <div className="flex items-center justify-center">
            <Link href={href} aria-hidden="true"
                  className={`p-3 ${pathname === href ? 'bg-lime-200 border border-black rounded-xl' : ''}`}>
                {children}
            </Link>
        </div>
    )
}

export default MobileNavigationItem;
