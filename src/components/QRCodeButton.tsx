
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
  showBeforeBooking?: boolean; // Added prop for showing QR before booking
}

export const QRCodeButton = ({ bookingData, preview = false, showBeforeBooking = false }: QRCodeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const qrData = JSON.stringify({
    id: preview ? 'preview-' + Math.random().toString(36).substring(7) : bookingData.id,
    item: bookingData.itemName,
    status: preview ? 'preview' : bookingData.status,
  });

  // Determine button text based on props
  const buttonText = () => {
    if (showBeforeBooking) return 'View QR Before Booking';
    if (preview) return 'Preview QR';
    return 'View QR';
  };

  // Determine dialog title based on props
  const dialogTitle = () => {
    if (showBeforeBooking) return 'Pre-booking QR Code';
    if (preview) return 'Preview QR Code';
    return 'Booking QR Code';
  };

  // Determine dialog description based on props
  const dialogDescription = () => {
    if (showBeforeBooking) return 'This is how your QR code will look after booking';
    if (preview) return 'This is a preview of how your QR code will look';
    return 'Scan this QR code to verify the booking';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {buttonText()}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle()}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <QRCodeSVG value={qrData} size={256} />
          <p className="mt-4 text-sm text-muted-foreground">
            {dialogDescription()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
