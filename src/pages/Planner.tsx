
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Itinerary, ItineraryActivity, 
  generateItinerary, saveItinerary, getItineraries, 
  getItineraryById, deleteItinerary, 
  formatRupees, addToCart
} from '@/utils/itineraryUtils';
import { MapPin, Calendar, Users, DollarSign, Edit, Trash2, ShoppingCart } from 'lucide-react';

const Planner = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [groupSize, setGroupSize] = useState('1');
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadItineraries();
    }
  }, [isAuthenticated, user]);

  const loadItineraries = async () => {
    if (user) {
      setIsLoading(true);
      try {
        const userItineraries = await getItineraries(user.id);
        setItineraries(userItineraries);
      } catch (error) {
        console.error('Error loading itineraries:', error);
        toast({
          title: "Error loading itineraries",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to create and save itineraries",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    try {
      // Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        toast({
          title: "Invalid date range",
          description: "End date cannot be before start date",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Generate itinerary
      const newItinerary = generateItinerary(
        user!.id,
        destination,
        startDate,
        endDate,
        Number(budget),
        Number(groupSize)
      );
      
      setGeneratedItinerary(newItinerary);
      
      toast({
        title: "Itinerary generated",
        description: `Your trip to ${destination} has been created.`,
      });
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast({
        title: "Error",
        description: "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItinerary = async () => {
    if (generatedItinerary) {
      setIsSaving(true);
      try {
        const savedItinerary = await saveItinerary(generatedItinerary);
        if (savedItinerary) {
          setGeneratedItinerary(null);
          
          // Reset form
          setDestination('');
          setStartDate('');
          setEndDate('');
          setBudget('');
          setGroupSize('1');
          
          // Reload itineraries
          await loadItineraries();
          
          toast({
            title: "Itinerary saved",
            description: "Your itinerary has been saved successfully.",
          });
        } else {
          throw new Error("Failed to save itinerary");
        }
      } catch (error) {
        console.error("Error saving itinerary:", error);
        toast({
          title: "Error",
          description: "Failed to save itinerary. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleEditItinerary = async (itinerary: Itinerary) => {
    setDestination(itinerary.destination);
    setStartDate(itinerary.startDate);
    setEndDate(itinerary.endDate);
    setBudget(itinerary.budget.toString());
    setGroupSize(itinerary.groupSize.toString());
    setGeneratedItinerary(itinerary);
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleDeleteItinerary = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await deleteItinerary(id);
      if (success) {
        await loadItineraries();
        toast({
          title: "Itinerary deleted",
          description: "Your itinerary has been deleted successfully.",
        });
      } else {
        throw new Error("Failed to delete itinerary");
      }
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      toast({
        title: "Error",
        description: "Failed to delete itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (activity: ItineraryActivity, itinerary: Itinerary) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to cart",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    try {
      const cartItem = await addToCart({
        itemType: 'activity',
        itemName: `${activity.title} in ${itinerary.destination}`,
        startDate: new Date(itinerary.startDate).toISOString(),
        price: activity.cost
      });
      
      if (cartItem) {
        toast({
          title: "Added to cart",
          description: `${activity.title} has been added to your cart.`,
        });
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Plan Your Journey</h1>
      <p className="text-muted-foreground mb-8">Create and manage your personalized travel itineraries</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>
                Fill in the details for your upcoming adventure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-10"
                      placeholder="Where do you want to go?"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (INR)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="budget"
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="pl-10"
                      placeholder="What's your budget?"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="groupSize">Number of Travelers</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="groupSize"
                      type="number"
                      value={groupSize}
                      onChange={(e) => setGroupSize(e.target.value)}
                      className="pl-10"
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-coral hover:bg-coral/90" disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate Itinerary'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {generatedItinerary ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Trip to {generatedItinerary.destination}</CardTitle>
                <CardDescription>
                  {formatDate(generatedItinerary.startDate)} - {formatDate(generatedItinerary.endDate)} 
                  • {generatedItinerary.groupSize} traveler{generatedItinerary.groupSize > 1 ? 's' : ''} 
                  • Budget: {formatRupees(generatedItinerary.budget)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(() => {
                    // First, group activities by day
                    const activitiesByDay: Record<number, ItineraryActivity[]> = {};
                    
                    // Sort activities by day and time
                    const sortedActivities = [...generatedItinerary.activities]
                      .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
                    
                    // Group them by day
                    sortedActivities.forEach(activity => {
                      if (!activitiesByDay[activity.day]) {
                        activitiesByDay[activity.day] = [];
                      }
                      activitiesByDay[activity.day].push(activity);
                    });
                    
                    // Convert the object to an array of [day, activities] entries for rendering
                    return Object.entries(activitiesByDay).map(([day, activities]) => (
                      <div key={day} className="border-t pt-4 first:border-t-0 first:pt-0">
                        <h3 className="font-bold text-lg mb-4">Day {day}</h3>
                        <ul className="space-y-4">
                          {activities.map((activity) => (
                            <li key={activity.id} className="p-4 rounded-md bg-muted/50">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-sm font-medium text-muted-foreground">{activity.time}</span>
                                  <h4 className="font-medium">{activity.title}</h4>
                                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                  <span className="text-sm font-medium">{formatRupees(activity.cost)}</span>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-xs px-2 py-1 h-auto"
                                    onClick={() => handleAddToCart(activity, generatedItinerary)}
                                  >
                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                    Add to Cart
                                  </Button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveItinerary} 
                  className="w-full bg-teal hover:bg-teal/90"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Itinerary'}
                </Button>
              </CardFooter>
            </Card>
          ) : itineraries.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Your Saved Itineraries</h2>
              {itineraries.map((itinerary) => (
                <Card key={itinerary.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{itinerary.destination}</CardTitle>
                        <CardDescription>
                          {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)} • 
                          {itinerary.groupSize} traveler{itinerary.groupSize > 1 ? 's' : ''} •
                          Budget: {formatRupees(itinerary.budget)}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="icon" variant="outline" onClick={() => handleEditItinerary(itinerary)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="text-destructive" 
                          onClick={() => handleDeleteItinerary(itinerary.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {itinerary.activities.length} activities planned over {
                          Math.ceil((new Date(itinerary.endDate).getTime() - new Date(itinerary.startDate).getTime()) / 
                            (1000 * 60 * 60 * 24))
                        } days
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {itinerary.activities.slice(0, 3).map((activity) => (
                          <div key={activity.id} className="p-3 rounded-md bg-muted/50 text-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium truncate">{activity.title}</p>
                                <p className="text-xs text-muted-foreground">Day {activity.day}</p>
                              </div>
                              <p className="text-xs font-medium">{formatRupees(activity.cost)}</p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-xs px-2 py-1 h-auto mt-2 w-full"
                              onClick={() => handleAddToCart(activity, itinerary)}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add to Cart
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 bg-muted/30 rounded-lg border border-dashed">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No Saved Itineraries</h2>
                <p className="text-muted-foreground mb-6">
                  Create your first itinerary by filling out the form on the left.
                </p>
                {!isAuthenticated && (
                  <Button asChild>
                    <a href="/login">Log In to Save Itineraries</a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Planner;
