
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

/**
 * Updates a user's profile in Supabase
 */
export const updateUserProfile = async (
  userId: string,
  userData: { name?: string; email?: string; location?: string }
): Promise<boolean> => {
  try {
    // Update user metadata (name)
    if (userData.name) {
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { name: userData.name }
      });

      if (metadataError) {
        console.error("Error updating user metadata:", metadataError);
        return false;
      }
    }

    // Update user email if provided
    if (userData.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: userData.email,
      });

      if (emailError) {
        console.error("Error updating user email:", emailError);
        return false;
      }
    }

    // Note: Location is static and is not actually stored in Supabase
    // It's retrieved via getUserLocation function
    
    console.log("User profile updated successfully");
    return true;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return false;
  }
};

/**
 * Gets the user's location (static value for Chembur, Mumbai)
 */
export const getUserLocation = (): string => {
  return "Chembur, Mumbai";
};

/**
 * Fetches the user's profile from Supabase
 */
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Error fetching user data:", userError);
      return null;
    }
    
    // Return user data with location
    return {
      ...userData.user,
      location: getUserLocation(),
    };
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return null;
  }
};
