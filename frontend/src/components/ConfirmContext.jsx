import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ConfirmContext = createContext(null);

function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const resolverRef = useRef(null);

  const confirm = useCallback((options) => {
    const settings = typeof options === "string" ? { message: options } : options;

    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialog({
        title: settings?.title || "Confirm Action",
        message: settings?.message || "Are you sure?",
        confirmText: settings?.confirmText || "Confirm",
        cancelText: settings?.cancelText || "Cancel",
      });
    });
  }, []);

  const closeDialog = useCallback((accepted) => {
    if (resolverRef.current) {
      resolverRef.current(accepted);
      resolverRef.current = null;
    }
    setDialog(null);
  }, []);

  const contextValue = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      {dialog && (
        <div className="confirm-overlay" onClick={() => closeDialog(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">{dialog.title}</h3>
            <p className="confirm-message">{dialog.message}</p>
            <div className="confirm-actions">
              <button type="button" className="confirm-cancel" onClick={() => closeDialog(false)}>
                {dialog.cancelText}
              </button>
              <button type="button" className="btn-danger" onClick={() => closeDialog(true)}>
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context;
}

export { ConfirmProvider, useConfirm };
