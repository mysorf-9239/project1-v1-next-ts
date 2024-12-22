import React from "react";
import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Mysorf",
    description: "Project 1 create by mysorf",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body>
        {children}
        </body>
        </html>
    );
}
