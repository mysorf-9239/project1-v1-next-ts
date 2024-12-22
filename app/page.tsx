import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Mysorf",
    description: "Project 1 create by mysorf",
};

export default function Home() {
    return (
        <div>
            <Link href={"/register"}
                  className="bg-primary-100 px-3 py-1 md:px-5 md:py-3 text-xs md:text-lg rounded-full border border-black uppercase font-bold duration-200 hover:shadow-[0px_5px_0px_0px_#191A23]">
                Start Now
            </Link>
        </div>
    );
}
