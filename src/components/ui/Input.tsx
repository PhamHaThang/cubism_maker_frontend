import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    className = "",
    id,
    ...props
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.14em]">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`w-full px-3.5 py-3 text-sm bg-white border border-neutral-300 rounded-xl outline-none transition-all duration-150 ease-in-out placeholder:text-neutral-400 focus:border-black focus:ring-2 focus:ring-black/10 ${
                    error
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                        : ""
                } ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};
