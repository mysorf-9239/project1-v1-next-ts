import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Mysorf",
    description: "Project 1 created by mysorf",
};

export default function Home() {
    return (
        <>
            <title>Mysorf | Home</title>

            <div
                className="h-screen bg-gradient-to-tl from-sky-500 via-cyan-600 to-purple-500 flex flex-col justify-center items-center">

                <div
                    className="absolute top-5 left-1/2 transform -translate-x-1/2 flex justify-between w-full max-w-4xl px-4 space-x-5">
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <p className="text-white hidden sm:block text-xs md:text-sm lg:text-base whitespace-nowrap">If
                            you have an account</p>
                        <Link
                            href="/login"
                            className="bg-lime-100 px-4 py-2 text-sm md:text-lg rounded-full border border-black uppercase font-bold duration-200 hover:shadow-[0px_5px_0px_0px_#191A23]"
                        >
                            Login
                        </Link>
                    </div>
                    <div className="flex-grow"></div>
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <p className="text-white hidden sm:block text-xs md:text-sm lg:text-base whitespace-nowrap">If
                            you are logged in</p>
                        <Link
                            href="/dashboard"
                            className="bg-lime-100 px-4 py-2 text-sm md:text-lg rounded-full border border-black uppercase font-bold duration-200 hover:shadow-[0px_5px_0px_0px_#191A23] whitespace-nowrap"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>

                <div className="mt-32">
                    <Link
                        href="/register"
                        className="bg-lime-100 px-6 py-3 text-sm md:text-xl rounded-full border border-black uppercase font-bold duration-200 hover:shadow-[0px_5px_0px_0px_#191A23]"
                    >
                        Start Now
                    </Link>
                </div>
            </div>
        </>
    );
}
