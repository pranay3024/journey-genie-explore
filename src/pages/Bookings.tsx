import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Trash2, Check, ShoppingCart, Package, QrCode } from 'lucide-react';
import { 
  BookingItem, getCartItems, getBookings, 
  confirmBooking, removeFromCart, formatRupees 
} from '@/utils/itineraryUtils';
import { QRCodeButton } from '@/components/QRCodeButton';

const Bookings = () => {
  const [cartItems, setCartItems] = useState<BookingItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      toast({
        title: "Authentication required",
        description: "Please log in to view your bookings",
        variant: "destructive",
      });
    } else {
      loadCartItems();
      loadBookings();
    }
  }, [isAuthenticated, navigate]);

  const loadCartItems = async () => {
    setIsLoadingCart(true);
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
      toast({
        title: "Error loading cart",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCart(false);
    }
  };

  const loadBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const items = await getBookings();
      setBookings(items);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: "Error loading bookings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleConfirmBooking = async (id: string) => {
    setIsProcessing(true);
    try {
      const success = await confirmBooking(id);
      if (success) {
        toast({
          title: "Booking confirmed",
          description: "Your booking has been confirmed successfully.",
        });
        await loadCartItems();
        await loadBookings();
      } else {
        throw new Error("Failed to confirm booking");
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast({
        title: "Error confirming booking",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFromCart = async (id: string) => {
    setIsProcessing(true);
    try {
      const success = await removeFromCart(id);
      if (success) {
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart.",
        });
        await loadCartItems();
      } else {
        throw new Error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        title: "Error removing item",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateTotal = (items: BookingItem[]) => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Bookings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Your Cart
                  </CardTitle>
                  <CardDescription>
                    Items waiting to be booked
                  </CardDescription>
                </div>
                {cartItems.length > 0 && (
                  <div className="text-right">
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-xl font-bold">{formatRupees(calculateTotal(cartItems))}</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingCart ? (
                <div className="flex justify-center py-8">
                  <p>Loading cart items...</p>
                </div>
              ) : cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-4 border rounded-lg flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{item.itemName}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(item.startDate)}
                          {item.endDate && ` - ${formatDate(item.endDate)}`}
                        </p>
                        <p className="text-sm font-medium mt-2">{formatRupees(item.price)}</p>
                        <div className="flex gap-2 mt-2">
                          <QRCodeButton 
                            bookingData={item} 
                            showBeforeBooking={true} 
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-destructive"
                          onClick={() => handleRemoveFromCart(item.id)}
                          disabled={isProcessing}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleConfirmBooking(item.id)}
                          disabled={isProcessing}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Book
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Your cart is empty</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add activities from itineraries to your cart to book them.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/planner')}
                  >
                    Browse Itineraries
                  </Button>
                </div>
              )}
            </CardContent>
            {cartItems.length > 0 && (
              <CardFooter className="flex justify-end">
                <Button 
                  className="bg-teal hover:bg-teal/90"
                  onClick={() => {
                    toast({
                      title: "Booking all items",
                      description: "This would process payment for all items in a real app.",
                    });
                    
                    const bookAll = async () => {
                      setIsProcessing(true);
                      try {
                        for (const item of cartItems) {
                          await confirmBooking(item.id);
                        }
                        toast({
                          title: "All items booked",
                          description: "All items have been booked successfully.",
                        });
                        await loadCartItems();
                        await loadBookings();
                      } catch (error) {
                        console.error('Error booking all items:', error);
                        toast({
                          title: "Error booking items",
                          description: "Some items could not be booked. Please try again.",
                          variant: "destructive",
                        });
                      } finally {
                        setIsProcessing(false);
                      }
                    };
                    
                    bookAll();
                  }}
                  disabled={isProcessing}
                >
                  Book All ({cartItems.length})
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Your Bookings
              </CardTitle>
              <CardDescription>
                Items you have booked for your trips
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingBookings ? (
                <div className="flex justify-center py-8">
                  <p>Loading bookings...</p>
                </div>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="p-4 border rounded-lg">
                      <h3 className="font-medium">{booking.itemName}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(booking.startDate)}
                        {booking.endDate && ` - ${formatDate(booking.endDate)}`}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm font-medium">{formatRupees(booking.price)}</p>
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                          Confirmed
                        </span>
                      </div>
                      <div className="mt-2">
                        <QRCodeButton bookingData={booking} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Package className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No bookings yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your confirmed bookings will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
