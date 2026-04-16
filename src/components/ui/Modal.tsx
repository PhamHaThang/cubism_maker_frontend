import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "max-w-lg",
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Content */}
            <div
                className={`relative ${maxWidth} w-full bg-white rounded-2xl border border-neutral-200 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto`}>
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-5 py-4 md:px-6 md:py-4 border-b border-neutral-100">
                        <h2 className="text-lg font-semibold text-black">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="p-5 md:p-6">{children}</div>
            </div>
        </div>
    );
};
