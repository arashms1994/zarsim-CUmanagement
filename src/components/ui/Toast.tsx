import React, { useState, useEffect } from "react";
import type { IToastProps } from "../../types/type";

const Toast: React.FC<IToastProps> = ({
  message,
  type,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastClasses = () => {
    const baseClasses =
      "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform";

    if (!isVisible) {
      return `${baseClasses} translate-x-full opacity-0`;
    }

    const typeClasses = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      info: "bg-blue-500 text-white",
    };

    return `${baseClasses} translate-x-0 opacity-100 ${typeClasses[type]}`;
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className={getToastClasses()}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{getIcon()}</span>
        <span className="font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className="ml-2 text-white hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      message: string;
      type: "success" | "error" | "info";
      duration?: number;
    }>
  >([]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );

  return {
    showToast,
    ToastContainer,
  };
};

export default Toast;
