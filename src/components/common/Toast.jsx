import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

const icons = {
  success: <CheckCircle2 size={18} className="text-success" />,
  error:   <AlertCircle   size={18} className="text-danger" />,
  warning: <AlertTriangle size={18} className="text-warning" />,
  info:    <Info          size={18} className="text-blue-500" />,
};

const bgMap = {
  success: 'bg-success/10 border-success/20',
  error:   'bg-danger/10  border-danger/20',
  warning: 'bg-warning/10 border-warning/20',
  info:    'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
};

const Toast = ({ message, type = 'info', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${bgMap[type]} shadow-lg animate-slide-up max-w-sm w-full`}>
      {icons[type]}
      <p className="text-sm font-medium text-textColor-light dark:text-textColor-dark flex-1">{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

// Toast container (rendered at top of app)
export const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
    {toasts.map((t) => (
      <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
    ))}
  </div>
);

// Hook to use toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const show = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
  return { toasts, show, remove, success: (m) => show(m, 'success'), error: (m) => show(m, 'error'), warning: (m) => show(m, 'warning') };
};

export default Toast;
