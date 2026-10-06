import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { CheckCircle2, AlertCircle, LoaderCircle, X } from "lucide-react";
interface Toast {
  id: number;
  type: "success" | "error" | "loading";
  message: string;
}
const ToastContext = createContext<
  { addToast: (toast: Omit<Toast, "id">) => void } | undefined
>(undefined);
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );
  const remove = (id: number) =>
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  const addToast = (toast: Omit<Toast, "id">) => {
    const id = ++counter.current;
    setToasts((prev) => [
      ...prev.filter(
        (item) => !(item.type === "loading" && toast.type !== "loading"),
      ),
      { ...toast, id },
    ]);
    timers.current.push(setTimeout(() => remove(id), 5000));
  };
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-region" aria-label="Notificações">
        {toasts.map((toast) => {
          const Icon =
            toast.type === "success"
              ? CheckCircle2
              : toast.type === "error"
                ? AlertCircle
                : LoaderCircle;
          return (
            <div
              key={toast.id}
              className={`toast toast-${toast.type}`}
              role={toast.type === "error" ? "alert" : "status"}
            >
              <Icon
                size={20}
                className={
                  toast.type === "loading"
                    ? "animate-spin shrink-0"
                    : "shrink-0"
                }
                aria-hidden="true"
              />
              <p className="flex-1">{toast.message}</p>
              <button
                className="button button-ghost icon-button"
                aria-label="Dispensar notificação"
                onClick={() => remove(toast.id)}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
