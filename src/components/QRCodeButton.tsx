
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QRCode from 'qrcode.react';

interface QRCodeButtonProps {
  bookingData: {
    id: string;
    item_name: string;
    status: string;
    [key: string]: any;
  };
}

export const QRCodeButton = ({ bookingData }: QRCodeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const qrData = JSON.stringify({
    id: bookingData.id,
    item: bookingData.item_name,
    status: bookingData.status,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View QR
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <QRCode value={qrData} size={256} />
          <p className="mt-4 text-sm text-muted-foreground">
            Scan this QR code to verify the booking
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
