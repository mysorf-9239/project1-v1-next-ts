import React from "react";
import {toast} from "react-toastify";

export default function HandlerError(error: Error) {
    if (error instanceof Response) {
        error.json().then((data) => {
            toast.error(
                <div className="text-black space-y-2 px-3">
                    <p>{data.message}</p>
                </div>, {
                    position: "top-right",
                    autoClose: 5_000,
                    hideProgressBar: true,
                    className: "bg-red-100 border border-black rounded-xl w-full shadow-[0px_5px_0px_0px_#191A23]",
                    closeButton: false
                });
        })
    } else {
        toast.error(
            <div className="text-black space-y-2 px-3">
                <p>Server Error</p>
            </div>, {
                position: "top-right",
                autoClose: 5_000,
                hideProgressBar: true,
                className: "bg-red-100 border border-black rounded-xl w-full shadow-[0px_5px_0px_0px_#191A23]",
                closeButton: false
            });
    }
}