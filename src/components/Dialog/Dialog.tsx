import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: 'alert' | 'confirm';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function Dialog({
  isOpen,
  title,
  message,
  type = 'alert',
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
}: DialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 transition-colors border border-gray-200 dark:border-gray-700">
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
          {type === 'confirm' && (
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 text-base font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 text-base font-medium bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
