import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
};

export const TradeConfirmationDialog: React.FC<Props> = ({ open, onOpenChange, onConfirm, title, description }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {title || 'Share this analysis to Active Trades?'}
          </DialogTitle>
        </DialogHeader>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="destructive"
            onClick={() => onOpenChange(false)}
            className="px-4"
          >
            No
          </Button>
          <Button
            onClick={() => {
              onConfirm();
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
