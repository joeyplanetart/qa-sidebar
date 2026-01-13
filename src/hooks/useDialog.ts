import { useState } from 'react';

interface DialogConfig {
  title?: string;
  message: string;
  type?: 'alert' | 'confirm';
  confirmText?: string;
  cancelText?: string;
}

export const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<DialogConfig>({
    message: '',
    type: 'alert',
  });
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const showAlert = (message: string, title?: string) => {
    return new Promise<boolean>((resolve) => {
      setConfig({
        message,
        title,
        type: 'alert',
      });
      setIsOpen(true);
      setResolvePromise(() => resolve);
    });
  };

  const showConfirm = (message: string, title?: string) => {
    return new Promise<boolean>((resolve) => {
      setConfig({
        message,
        title,
        type: 'confirm',
      });
      setIsOpen(true);
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
  };

  return {
    isOpen,
    config,
    showAlert,
    showConfirm,
    handleConfirm,
    handleCancel,
  };
};
