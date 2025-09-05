"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  setPersistence, 
  browserLocalPersistence, 
  User 
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "../firebaseConfig"; // Adjust the path if necessary

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create the context with a default value of null for user and loading
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Set session persistence to local (i.e., stay signed in until manually logged out)
        await setPersistence(auth, browserLocalPersistence);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user); // Firebase User object is now set correctly
          } else {
            setUser(null); // Set null if the user is not logged in
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error setting up Firebase Auth", error);
        setLoading(false);
      }
    };

    initAuth();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};