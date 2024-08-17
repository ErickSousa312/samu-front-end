import { useEffect } from 'react';

type ToastType = 'loading' | 'success' | 'error';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast = ({ type, message, duration = 1000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    loading: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg text-white shadow-lg ${typeStyles[type]}`}>
      {type === 'loading' && <span>⏳</span>}
      {type === 'success' && <span>✅</span>}
      {type === 'error' && <span>❌</span>}
      <span className="ml-2">{message}</span>
    </div>
  );
};

export default Toast;
