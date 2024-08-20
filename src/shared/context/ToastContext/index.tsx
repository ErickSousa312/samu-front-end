import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'loading';
  message: string;
}

interface ToastContextProps {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let idCounter = 1;

  const addToast = (toast: Omit<Toast, 'id'>) => {
    setToasts(prevToasts => {
      const updatedToasts = prevToasts.filter(t => !(t.type === 'loading' && toast.type !== 'loading'));
      return [...updatedToasts, { ...toast, id: idCounter++ }];
    });

    // Remove the toast after 5 seconds
    setTimeout(() => {
      setToasts(prevToasts =>
        prevToasts.filter(t => t.id !== idCounter - 1)
      );
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-14 right-0 p-4 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md text-white ${
              toast.type === 'loading'
                ? 'bg-yellow-500 flex items-center'
                : toast.type === 'success'
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}
          >
            {toast.type === 'loading' && (
              <div className="mr-2 animate-spin border-4 border-t-transparent border-white rounded-full w-5 h-5"></div>
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
