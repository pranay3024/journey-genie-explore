
export type Itinerary = {
  id: string;
  userId: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  groupSize: number;
  activities: ItineraryActivity[];
  createdAt: string;
  updatedAt: string;
};

export type ItineraryActivity = {
  id: string;
  day: number;
  title: string;
  description: string;
  time: string;
  cost: number;
};

// Save itinerary to localStorage
export const saveItinerary = (itinerary: Itinerary): void => {
  const itineraries = getItineraries();
  const existingIndex = itineraries.findIndex(i => i.id === itinerary.id);
  
  if (existingIndex >= 0) {
    itineraries[existingIndex] = {
      ...itinerary,
      updatedAt: new Date().toISOString()
    };
  } else {
    itineraries.push({
      ...itinerary,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem('itineraries', JSON.stringify(itineraries));
};

// Get all itineraries for a user
export const getItineraries = (userId?: string): Itinerary[] => {
  const itineraries = JSON.parse(localStorage.getItem('itineraries') || '[]');
  if (userId) {
    return itineraries.filter((itinerary: Itinerary) => itinerary.userId === userId);
  }
  return itineraries;
};

// Get a single itinerary by ID
export const getItineraryById = (id: string): Itinerary | undefined => {
  const itineraries = getItineraries();
  return itineraries.find((itinerary: Itinerary) => itinerary.id === id);
};

// Delete an itinerary
export const deleteItinerary = (id: string): void => {
  const itineraries = getItineraries();
  const filteredItineraries = itineraries.filter((itinerary: Itinerary) => itinerary.id !== id);
  localStorage.setItem('itineraries', JSON.stringify(filteredItineraries));
};

// Generate a simple itinerary template
export const generateItinerary = (
  userId: string,
  destination: string,
  startDate: string,
  endDate: string,
  budget: number,
  groupSize: number
): Itinerary => {
  // Calculate number of days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Mock activities based on number of days
  const activities: ItineraryActivity[] = [];
  for (let day = 1; day <= days; day++) {
    activities.push({
      id: Math.random().toString(36).substring(2, 9),
      day,
      title: day === 1 ? 'Arrival & Check-in' : day === days ? 'Departure' : `Explore ${destination} - Day ${day}`,
      description: day === 1 ? 'Arrive at destination and check into accommodation' : 
                  day === days ? 'Check out and depart' : 'Explore local attractions and enjoy local cuisine',
      time: day === 1 ? '14:00' : day === days ? '11:00' : '09:00',
      cost: Math.round(budget / days / groupSize) * groupSize
    });
    
    if (day !== days) {
      activities.push({
        id: Math.random().toString(36).substring(2, 9),
        day,
        title: 'Dinner',
        description: 'Enjoy local cuisine',
        time: '19:00',
        cost: Math.round((budget * 0.2) / days / groupSize) * groupSize
      });
    }
  }
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    userId,
    destination,
    startDate,
    endDate,
    budget,
    groupSize,
    activities,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};
