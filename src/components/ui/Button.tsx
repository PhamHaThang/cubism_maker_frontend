import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    isLoading = false,
    children,
    className = "",
    disabled,
    ...props
}) => {
    const baseStyles =
        "inline-flex items-center justify-center font-semibold tracking-[0.01em] transition-all duration-150 ease-in-out rounded-xl border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20";

    const variants = {
        primary:
            "bg-black text-white border-black hover:bg-neutral-800 hover:border-neutral-800 shadow-[0_10px_25px_-18px_rgba(0,0,0,1)]",
        secondary:
            "bg-white text-black border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 hover:-translate-y-[1px]",
        ghost: "bg-transparent text-black border-transparent hover:bg-neutral-100 hover:-translate-y-[1px]",
        danger: "bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:-translate-y-[1px]",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs gap-1.5",
        md: "px-4 py-2.5 text-sm gap-2",
        lg: "px-6 py-3 text-base gap-2",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}>
            {isLoading && (
                <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
};
