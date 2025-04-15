
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

// Extend User type to include metadata
interface AppUser extends User {
  name?: string;
}

type AuthContextType = {
  user: AppUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        
        if (newSession?.user) {
          // Extract name from user metadata
          const userData = newSession.user as AppUser;
          // Check if user metadata has a name field
          if (newSession.user.user_metadata && newSession.user.user_metadata.name) {
            userData.name = newSession.user.user_metadata.name;
          }
          setUser(userData);
        } else {
          setUser(null);
        }
        
        setIsAuthenticated(!!newSession?.user);
      });
      
      // Get initial session
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      if (data.session?.user) {
        // Extract name from user metadata
        const userData = data.session.user as AppUser;
        // Check if user metadata has a name field
        if (data.session.user.user_metadata && data.session.user.user_metadata.name) {
          userData.name = data.session.user.user_metadata.name;
        }
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setIsAuthenticated(!!data.session?.user);
      
      setIsLoading(false);
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        return false;
      }
      
      return !!data.user;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        console.error("Registration error:", error);
        return false;
      }
      
      return !!data.user;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, session, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
