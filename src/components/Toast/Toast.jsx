// leitores de tela anunciem os feedbacks ao usuário.

import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

const STYLES = {
  success: {
    container: "bg-green-50 border-green-200 text-green-800",
    icon: <CheckCircle size={18} className="text-green-600 flex-shrink-0" />,
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: <XCircle size={18} className="text-red-600 flex-shrink-0" />,
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: <AlertCircle size={18} className="text-yellow-600 flex-shrink-0" />,
  },
};

export function ToastItem({ toast, onRemove }) {
  const style = STYLES[toast.type] ?? STYLES.success;
  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`flex items-center gap-3 border rounded-xl px-4 py-3 shadow-lg text-sm font-medium animate-slide-in ${style.container}`}
    >
      {style.icon}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Fechar notificação"
        className="opacity-50 hover:opacity-100 transition ml-1"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div
      aria-label="Notificações"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm w-full"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
