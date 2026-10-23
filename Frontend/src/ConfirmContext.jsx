import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export const ConfirmContext = createContext(null);

// Promise-based replacement for window.confirm():
//   if (!(await confirm({ title, message, confirmLabel, danger: true }))) return;
export function ConfirmContextProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const resolver = useRef(null);
  const confirmButton = useRef(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      resolver.current = resolve;
      setDialog({
        title: "Are you sure?",
        message: "",
        confirmLabel: "Confirm",
        cancelLabel: "Cancel",
        danger: false,
        ...options,
      });
    });
  }, []);

  const close = useCallback((result) => {
    resolver.current?.(result);
    resolver.current = null;
    setDialog(null);
  }, []);

  useEffect(() => {
    if (!dialog) return;
    const previouslyFocused = document.activeElement;
    confirmButton.current?.focus();
    const onKeyDown = (ev) => {
      if (ev.key === "Escape") close(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [dialog, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialog && (
        <div
          className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4 bg-black/40 dialog-backdrop"
          onMouseDown={(ev) => {
            if (ev.target === ev.currentTarget) close(false);
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
            className="dialog-panel w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6"
          >
            <div className="flex items-start gap-4">
              {dialog.danger && (
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FaExclamationTriangle />
                </div>
              )}
              <div>
                <h2 id="confirm-title" className="text-lg font-bold text-gray-900">
                  {dialog.title}
                </h2>
                {dialog.message && (
                  <p id="confirm-message" className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {dialog.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => close(false)}
                className="bg-white border border-gray-300 text-gray-800 font-semibold text-sm py-2.5 px-5 rounded-xl hover:bg-gray-50"
              >
                {dialog.cancelLabel}
              </button>
              <button
                ref={confirmButton}
                type="button"
                onClick={() => close(true)}
                className={`${
                  dialog.danger ? "bg-primary" : "bg-gray-900"
                } text-white font-semibold text-sm py-2.5 px-5 rounded-xl hover:opacity-90`}
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used inside ConfirmContextProvider");
  return context;
}
