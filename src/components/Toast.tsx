import { useToast } from '../lib/ToastContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const typeStyles = {
  success: {
    bg: 'bg-[#7CA982]',
    text: 'text-white',
    icon: CheckCircle,
    border: 'border-[#5a8a6a]',
  },
  error: {
    bg: 'bg-[#cf3f5c]',
    text: 'text-white',
    icon: XCircle,
    border: 'border-[#b03550]',
  },
  warning: {
    bg: 'bg-[#F5C542]',
    text: 'text-[#1E1E1E]',
    icon: AlertTriangle,
    border: 'border-[#d4a836]',
  },
  info: {
    bg: 'bg-[#CDE6E0]',
    text: 'text-[#2D5444]',
    icon: Info,
    border: 'border-[#9fc9c0]',
  },
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full px-2 sm:px-0"
      aria-live="polite"
      role="region"
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => {
        const style = typeStyles[toast.type];
        const Icon = style.icon;
        return (
          <div
            key={toast.id}
            className={`
              flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border
              ${style.bg} ${style.text} ${style.border}
              animate-toast-in
            `}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden />
            <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
