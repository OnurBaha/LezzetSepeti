import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Yükleniyor...' }) => {
  const sizes = { sm: 16, md: 32, lg: 48 };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 size={sizes[size]} className="text-primary animate-spin" />
      {text && <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse-soft">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
