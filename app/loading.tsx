import React from "react";
import Image from "next/image";

export default function Loading() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
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
