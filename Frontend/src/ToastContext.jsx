import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

export const ToastContext = createContext(null);

const DEFAULT_DURATION = 3500;
const MAX_TOASTS = 4;

const variants = {
  success: { icon: FaCheckCircle, accent: "text-emerald-500", bar: "bg-emerald-500" },
  error: { icon: FaExclamationCircle, accent: "text-primary", bar: "bg-primary" },
  info: { icon: FaInfoCircle, accent: "text-sky-500", bar: "bg-sky-500" },
};

export function ToastContextProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, type = "info", duration = DEFAULT_DURATION) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type, duration }].slice(-MAX_TOASTS));
      timers.current.set(id, setTimeout(() => dismiss(id), duration));
      return id;
    },
    [dismiss]
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  const toast = useMemo(
    () => ({
      success: (message, duration) => show(message, "success", duration),
      error: (message, duration) => show(message, "error", duration),
      info: (message, duration) => show(message, "info", duration),
      dismiss,
    }),
    [show, dismiss]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="fixed z-[100] bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 flex flex-col gap-2 sm:w-96 pointer-events-none"
      >
        {toasts.map((t) => {
          const variant = variants[t.type] || variants.info;
          const Icon = variant.icon;
          return (
            <div
              key={t.id}
              role={t.type === "error" ? "alert" : "status"}
              className="toast-enter pointer-events-auto relative overflow-hidden flex items-start gap-3 bg-white border border-gray-200 shadow-xl rounded-2xl py-3 pl-4 pr-3"
            >
              <Icon className={`${variant.accent} text-lg shrink-0 mt-0.5`} />
              <p className="text-sm font-medium text-gray-800 grow leading-snug">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="bg-transparent text-gray-400 hover:text-gray-700 p-1 rounded-full shrink-0"
              >
                <FaTimes className="text-xs" />
              </button>
              <span
                className={`toast-progress absolute bottom-0 left-0 h-0.5 ${variant.bar}`}
                style={{ animationDuration: `${t.duration}ms` }}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastContextProvider");
  return context;
}
