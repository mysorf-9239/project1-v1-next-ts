import Image from "next/image";
import React from "react";

export default function Loading() {
    return (
        <div className="flex justify-center items-center w-full min-h-screen">
            <Image
                alt="Foodie Maryam - Loading 3"
                width={732}
                height={558}
                src="https://cdn.dribbble.com/users/393062/screenshots/14492170/media/67f661f7f825b62980571026e1280675.gif"
                unoptimized
            />
        </div>
    );
}