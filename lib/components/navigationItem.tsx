'use client';

import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const activeClasses: string = 'border border-l-0 border-black bg-primary-100 shadow-[0px_5px_0px_0px_#191A23]';
const inactiveClasses: string = 'border-l-0 border border-secondary-100 hover:bg-white hover:border-white';

const NavigationItem: React.FC<{ href: string, children: React.ReactNode }> = ({href, children}) => {
    const pathname: string = usePathname();

    return (
        <Link href={href}
              className={`flex items-center space-x-4 p-4 pl-10 rounded-e-2xl my-2 font-bold ${pathname === href ? activeClasses : inactiveClasses}`}>
            {children}
        </Link>
    );
};

export default NavigationItem;
