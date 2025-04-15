
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

    console.log("User profile updated successfully");
    return true;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return false;
  }
};

/**
 * Gets the user's location (currently returns static value)
 */
export const getUserLocation = (): string => {
  return "Chembur, Mumbai";
};
