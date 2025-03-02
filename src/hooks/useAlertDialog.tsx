import * as React from 'react';

export const useAlertDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [resolvePromise, setResolvePromise] = React.useState<
    ((action: boolean) => void) | null
  >(null);

  const openDialog = () => {
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
      setIsOpen(true);
    });
  };

  const closeDialog = (result: boolean) => {
    resolvePromise?.(result);
    setIsOpen(false);
  };

  return {
    openDialog,
    closeDialog,
    isOpen,
    setIsOpen,
  };
};
