
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeButtonProps {
  bookingData: {
    id: string;
    itemName: string;
    status: string;
    [key: string]: any;
  };
  preview?: boolean;
}

export const QRCodeButton = ({ bookingData, preview = false }: QRCodeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const qrData = JSON.stringify({
    id: preview ? 'preview-' + Math.random().toString(36).substring(7) : bookingData.id,
    item: bookingData.itemName,
    status: preview ? 'preview' : bookingData.status,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {preview ? 'Preview QR' : 'View QR'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{preview ? 'Preview QR Code' : 'Booking QR Code'}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <QRCodeSVG value={qrData} size={256} />
          <p className="mt-4 text-sm text-muted-foreground">
            {preview ? 'This is a preview of how your QR code will look' : 'Scan this QR code to verify the booking'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
