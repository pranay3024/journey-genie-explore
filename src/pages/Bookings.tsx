
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Plane, Building2, Compass, Clock, Star } from 'lucide-react';

type BookingItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  duration?: string;
  location: string;
  category: 'flight' | 'hotel' | 'activity';
};

const bookings: BookingItem[] = [
  // Flights
  {
    id: 'f1',
    title: 'New York to Paris',
    description: 'Direct flight with Air France',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074',
    price: 489,
    rating: 4.2,
    duration: '7h 30m',
    location: 'JFK → CDG',
    category: 'flight'
  },
  {
    id: 'f2',
    title: 'London to Tokyo',
    description: 'One stop in Dubai with Emirates',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2071',
    price: 723,
    rating: 4.5,
    duration: '14h 15m',
    location: 'LHR → NRT',
    category: 'flight'
  },
  {
    id: 'f3',
    title: 'Los Angeles to Rome',
    description: 'Direct flight with Alitalia',
    image: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=2070',
    price: 682,
    rating: 4.1,
    duration: '12h 45m',
    location: 'LAX → FCO',
    category: 'flight'
  },
  
  // Hotels
  {
    id: 'h1',
    title: 'Grand Plaza Hotel',
    description: 'Luxury 5-star hotel with pool and spa',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
    price: 199,
    rating: 4.8,
    location: 'Paris, France',
    category: 'hotel'
  },
  {
    id: 'h2',
    title: 'Sakura Ryokan',
    description: 'Traditional Japanese inn with hot springs',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070',
    price: 145,
    rating: 4.6,
    location: 'Kyoto, Japan',
    category: 'hotel'
  },
  {
    id: 'h3',
    title: 'Colosseum View Suites',
    description: 'Boutique hotel with panoramic views',
    image: 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=2070',
    price: 232,
    rating: 4.7,
    location: 'Rome, Italy',
    category: 'hotel'
  },
  
  // Activities
  {
    id: 'a1',
    title: 'Louvre Museum Tour',
    description: 'Skip-the-line guided tour of famous artworks',
    image: 'https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2?q=80&w=2022',
    price: 65,
    rating: 4.9,
    duration: '3h',
    location: 'Paris, France',
    category: 'activity'
  },
  {
    id: 'a2',
    title: 'Mount Fuji Day Trip',
    description: 'Full-day excursion with lunch included',
    image: 'https://images.unsplash.com/photo-1570459027562-4a916cc6368f?q=80&w=2070',
    price: 120,
    rating: 4.7,
    duration: '10h',
    location: 'Tokyo, Japan',
    category: 'activity'
  },
  {
    id: 'a3',
    title: 'Vatican & Sistine Chapel',
    description: 'Private tour with expert art historian',
    image: 'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d4?q=80&w=2001',
    price: 89,
    rating: 4.8,
    duration: '4h',
    location: 'Rome, Italy',
    category: 'activity'
  }
];

const Bookings = () => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 800]);
  const [ratingFilter, setRatingFilter] = useState<string>("any");
  const [filteredItems, setFilteredItems] = useState<BookingItem[]>(bookings);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    filterItems(activeTab, value, ratingFilter);
  };
  
  const handleRatingChange = (value: string) => {
    setRatingFilter(value);
    filterItems(activeTab, priceRange, value);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    filterItems(value, priceRange, ratingFilter);
  };
  
  const filterItems = (tab: string, price: number[], rating: string) => {
    let items = bookings;
    
    // Filter by category
    if (tab !== "all") {
      items = items.filter(item => item.category === tab);
    }
    
    // Filter by price
    items = items.filter(item => item.price >= price[0] && item.price <= price[1]);
    
    // Filter by rating
    if (rating !== "any") {
      const minRating = parseFloat(rating);
      items = items.filter(item => item.rating >= minRating);
    }
    
    setFilteredItems(items);
  };
  
  const renderBookingIcon = (category: string) => {
    switch (category) {
      case 'flight':
        return <Plane className="h-5 w-5 text-teal" />;
      case 'hotel':
        return <Building2 className="h-5 w-5 text-teal" />;
      case 'activity':
        return <Compass className="h-5 w-5 text-teal" />;
      default:
        return null;
    }
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        <Star className="h-4 w-4 fill-coral text-coral" />
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Travel Bookings</h1>
      <p className="text-muted-foreground mb-8">Find and book your next flights, hotels, and activities</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Refine your search results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Price Range (${priceRange[0]} - ${priceRange[1]})</Label>
                <Slider
                  defaultValue={[0, 800]}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <RadioGroup value={ratingFilter} onValueChange={handleRatingChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="any" />
                    <Label htmlFor="any">Any rating</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="three" />
                    <Label htmlFor="three">3+ stars</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="four" />
                    <Label htmlFor="four">4+ stars</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4.5" id="fourHalf" />
                    <Label htmlFor="fourHalf">4.5+ stars</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Results */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="all" onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="flight">Flights</TabsTrigger>
              <TabsTrigger value="hotel">Hotels</TabsTrigger>
              <TabsTrigger value="activity">Activities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 rounded-full p-2">
                        {renderBookingIcon(item.category)}
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        {renderStars(item.rating)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {item.duration && (
                          <span className="flex items-center mr-3">
                            <Clock className="mr-1 h-3 w-3" />
                            {item.duration}
                          </span>
                        )}
                        <span>{item.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <div className="font-bold text-lg">
                        ${item.price}
                        <span className="text-xs text-muted-foreground font-normal">
                          {item.category === 'hotel' ? '/night' : ''}
                        </span>
                      </div>
                      <Button>Book Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredItems.length === 0 && (
                <div className="bg-muted/30 rounded-lg border border-dashed p-8 text-center">
                  <h3 className="font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="flight" className="mt-0">
              {/* Flight-specific content would go here if needed */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 rounded-full p-2">
                        {renderBookingIcon(item.category)}
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        {renderStars(item.rating)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {item.duration && (
                          <span className="flex items-center mr-3">
                            <Clock className="mr-1 h-3 w-3" />
                            {item.duration}
                          </span>
                        )}
                        <span>{item.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <div className="font-bold text-lg">
                        ${item.price}
                      </div>
                      <Button>Book Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredItems.length === 0 && (
                <div className="bg-muted/30 rounded-lg border border-dashed p-8 text-center">
                  <h3 className="font-medium mb-2">No flights found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="hotel" className="mt-0">
              {/* Hotel-specific content would go here if needed */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 rounded-full p-2">
                        {renderBookingIcon(item.category)}
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        {renderStars(item.rating)}
                      </div>
                      <CardDescription>{item.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <div className="font-bold text-lg">
                        ${item.price}
                        <span className="text-xs text-muted-foreground font-normal">/night</span>
                      </div>
                      <Button>Book Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredItems.length === 0 && (
                <div className="bg-muted/30 rounded-lg border border-dashed p-8 text-center">
                  <h3 className="font-medium mb-2">No hotels found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="activity" className="mt-0">
              {/* Activity-specific content would go here if needed */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 rounded-full p-2">
                        {renderBookingIcon(item.category)}
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        {renderStars(item.rating)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {item.duration && (
                          <span className="flex items-center mr-3">
                            <Clock className="mr-1 h-3 w-3" />
                            {item.duration}
                          </span>
                        )}
                        <span>{item.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <div className="font-bold text-lg">
                        ${item.price}
                      </div>
                      <Button>Book Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredItems.length === 0 && (
                <div className="bg-muted/30 rounded-lg border border-dashed p-8 text-center">
                  <h3 className="font-medium mb-2">No activities found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
