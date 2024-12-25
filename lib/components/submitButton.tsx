import React from "react";

interface SubmitButtonProps {
    content: string | React.ReactNode;
    onClick: () => void;
}

export default function SubmitButton({ content, onClick }: SubmitButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="px-4 py-2 bg-lime-200 border border-black rounded-xl hover:border-b-4 transition-all duration-300 font-semibold"
        >
            {content}
        </button>
    );
}
