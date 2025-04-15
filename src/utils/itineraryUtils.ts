
import { supabase } from "@/integrations/supabase/client";

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

export type BookingItem = {
  id: string;
  userId: string;
  itemType: string;
  itemName: string;
  startDate: string;
  endDate?: string;
  price: number;
  status: 'cart' | 'booked' | 'cancelled';
  createdAt: string;
};

// Currency conversion
export const USD_TO_INR_RATE = 83.13; // Example rate, in a real app you would use an API

export const convertToRupees = (dollars: number): number => {
  return Math.round(dollars * USD_TO_INR_RATE);
};

export const formatRupees = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Save itinerary to Supabase
export const saveItinerary = async (itinerary: Itinerary): Promise<Itinerary | null> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const now = new Date().toISOString();
    let savedItinerary: Itinerary | null = null;

    // Check if itinerary exists
    const { data: existingData, error: fetchError } = await supabase
      .from('itineraries')
      .select('id')
      .eq('id', itinerary.id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingData) {
      // Update existing itinerary
      const { data, error } = await supabase
        .from('itineraries')
        .update({
          destination: itinerary.destination,
          start_date: itinerary.startDate,
          end_date: itinerary.endDate,
          budget: itinerary.budget,
          group_size: itinerary.groupSize,
          updated_at: now
        })
        .eq('id', itinerary.id)
        .select()
        .single();

      if (error) throw error;
      
      // Delete existing activities
      const { error: deleteError } = await supabase
        .from('activities')
        .delete()
        .eq('itinerary_id', itinerary.id);
        
      if (deleteError) throw deleteError;

      // Convert DB format to app format
      if (data) {
        savedItinerary = {
          id: data.id,
          userId: data.user_id,
          destination: data.destination,
          startDate: data.start_date,
          endDate: data.end_date,
          budget: data.budget,
          groupSize: data.group_size,
          activities: [],
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
      }
    } else {
      // Create new itinerary
      const { data, error } = await supabase
        .from('itineraries')
        .insert({
          user_id: user.id,
          destination: itinerary.destination,
          start_date: itinerary.startDate,
          end_date: itinerary.endDate,
          budget: itinerary.budget,
          group_size: itinerary.groupSize
        })
        .select()
        .single();

      if (error) throw error;
      
      // Convert DB format to app format
      if (data) {
        savedItinerary = {
          id: data.id,
          userId: data.user_id,
          destination: data.destination,
          startDate: data.start_date,
          endDate: data.end_date,
          budget: data.budget,
          groupSize: data.group_size,
          activities: [],
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
      }
    }

    // Insert activities
    if (savedItinerary && itinerary.activities.length > 0) {
      // Format activities for database insertion
      const activitiesToInsert = itinerary.activities.map(activity => ({
        itinerary_id: savedItinerary!.id,
        day: activity.day,
        title: activity.title,
        description: activity.description,
        time: activity.time,
        cost: activity.cost
      }));

      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .insert(activitiesToInsert)
        .select();

      if (activitiesError) throw activitiesError;
      
      // Convert DB format to app format
      if (activitiesData) {
        savedItinerary.activities = activitiesData.map(act => ({
          id: act.id,
          day: act.day,
          title: act.title,
          description: act.description || '',
          time: act.time,
          cost: act.cost
        }));
      }
    }

    return savedItinerary;
  } catch (error) {
    console.error('Error saving itinerary:', error);
    return null;
  }
};

// Get all itineraries for a user
export const getItineraries = async (userId?: string): Promise<Itinerary[]> => {
  try {
    // If no userId provided, get current user
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      userId = user.id;
    }
    
    // Get itineraries
    const { data: itinerariesData, error: itinerariesError } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', userId);
      
    if (itinerariesError) throw itinerariesError;
    if (!itinerariesData) return [];
    
    const itineraries: Itinerary[] = [];
    
    // For each itinerary, get its activities
    for (const item of itinerariesData) {
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .eq('itinerary_id', item.id);
        
      if (activitiesError) throw activitiesError;
      
      // Convert DB format to app format
      itineraries.push({
        id: item.id,
        userId: item.user_id,
        destination: item.destination,
        startDate: item.start_date,
        endDate: item.end_date,
        budget: item.budget,
        groupSize: item.group_size,
        activities: activitiesData ? activitiesData.map(act => ({
          id: act.id,
          day: act.day,
          title: act.title,
          description: act.description || '',
          time: act.time,
          cost: act.cost
        })) : [],
        createdAt: item.created_at,
        updatedAt: item.updated_at
      });
    }
    
    return itineraries;
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return [];
  }
};

// Get a single itinerary by ID
export const getItineraryById = async (id: string): Promise<Itinerary | undefined> => {
  try {
    // Get itinerary
    const { data: itineraryData, error: itineraryError } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (itineraryError) throw itineraryError;
    if (!itineraryData) return undefined;
    
    // Get activities
    const { data: activitiesData, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .eq('itinerary_id', id);
      
    if (activitiesError) throw activitiesError;
    
    // Convert DB format to app format
    return {
      id: itineraryData.id,
      userId: itineraryData.user_id,
      destination: itineraryData.destination,
      startDate: itineraryData.start_date,
      endDate: itineraryData.end_date,
      budget: itineraryData.budget,
      groupSize: itineraryData.group_size,
      activities: activitiesData ? activitiesData.map(act => ({
        id: act.id,
        day: act.day,
        title: act.title,
        description: act.description || '',
        time: act.time,
        cost: act.cost
      })) : [],
      createdAt: itineraryData.created_at,
      updatedAt: itineraryData.updated_at
    };
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return undefined;
  }
};

// Delete an itinerary
export const deleteItinerary = async (id: string): Promise<boolean> => {
  try {
    // Activities will be cascade deleted due to foreign key constraint
    const { error } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return false;
  }
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
    // Daily budget in rupees for activities (converted from dollars)
    const dailyBudget = convertToRupees(Math.round(budget / days / groupSize) * groupSize);
    const dinnerBudget = convertToRupees(Math.round((budget * 0.2) / days / groupSize) * groupSize);
    
    activities.push({
      id: Math.random().toString(36).substring(2, 9),
      day,
      title: day === 1 ? 'Arrival & Check-in' : day === days ? 'Departure' : `Explore ${destination} - Day ${day}`,
      description: day === 1 ? 'Arrive at destination and check into accommodation' : 
                  day === days ? 'Check out and depart' : 'Explore local attractions and enjoy local cuisine',
      time: day === 1 ? '14:00' : day === days ? '11:00' : '09:00',
      cost: dailyBudget
    });
    
    if (day !== days) {
      activities.push({
        id: Math.random().toString(36).substring(2, 9),
        day,
        title: 'Dinner',
        description: 'Enjoy local cuisine',
        time: '19:00',
        cost: dinnerBudget
      });
    }
  }
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    userId,
    destination,
    startDate,
    endDate,
    budget: convertToRupees(budget), // Convert budget to rupees
    groupSize,
    activities,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Cart and booking functions
export const addToCart = async (item: Omit<BookingItem, 'id' | 'userId' | 'createdAt' | 'status'>): Promise<BookingItem | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        item_type: item.itemType,
        item_name: item.itemName,
        start_date: item.startDate,
        end_date: item.endDate,
        price: item.price,
        status: 'cart'
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data ? {
      id: data.id,
      userId: data.user_id,
      itemType: data.item_type,
      itemName: data.item_name,
      startDate: data.start_date,
      endDate: data.end_date,
      price: data.price,
      status: data.status,
      createdAt: data.created_at
    } : null;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
};

export const getCartItems = async (): Promise<BookingItem[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'cart');
      
    if (error) throw error;
    
    return data ? data.map(item => ({
      id: item.id,
      userId: item.user_id,
      itemType: item.item_type,
      itemName: item.item_name,
      startDate: item.start_date,
      endDate: item.end_date,
      price: item.price,
      status: item.status,
      createdAt: item.created_at
    })) : [];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
};

export const confirmBooking = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'booked' })
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error confirming booking:', error);
    return false;
  }
};

export const removeFromCart = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)
      .eq('status', 'cart');
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return false;
  }
};

export const getBookings = async (): Promise<BookingItem[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'booked');
      
    if (error) throw error;
    
    return data ? data.map(item => ({
      id: item.id,
      userId: item.user_id,
      itemType: item.item_type,
      itemName: item.item_name,
      startDate: item.start_date,
      endDate: item.end_date,
      price: item.price,
      status: item.status,
      createdAt: item.created_at
    })) : [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};
