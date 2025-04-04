// components/common/Toast.tsx
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number; // Durée en ms avant fermeture automatique
}

const Toast: React.FC<ToastProps> = ({
    message,
    type,
    isVisible,
    onClose,
    duration = 3000
}) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-white" />;
            case 'error':
                return <AlertTriangle className="h-5 w-5 text-white" />;
            case 'info':
                return <Info className="h-5 w-5 text-white" />;
            default:
                return null;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            case 'info':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
            <div className={`${getBackgroundColor()} text-white p-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md`}>
                {getIcon()}
                <span className="flex-1">{message}</span>
                <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default Toast;