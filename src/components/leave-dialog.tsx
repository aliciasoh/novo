import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

interface LeaveDialogProps {
  closeDialog: (action: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export function LeaveDialog({ closeDialog, setIsOpen }: LeaveDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('leave-dialog-title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('leave-dialog-desc')}
          </AlertDialogDescription>
          <Button
            variant="ghost"
            className="absolute right-[10px] top-[20px]"
            onClick={() => setIsOpen(false)}
          >
            X
          </Button>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => closeDialog(false)}>
            {t('leave-dialog-continue')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => closeDialog(true)}>
            {t('leave-dialog-save-close')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
