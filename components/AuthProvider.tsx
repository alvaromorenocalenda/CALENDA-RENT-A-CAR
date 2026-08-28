"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (currentUser: User | null) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }
    try {
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        setProfile({ uid: currentUser.uid, ...(snap.data() as Omit<UserProfile, "uid">) });
      } else {
        setProfile({
          uid: currentUser.uid,
          name: currentUser.displayName || "Cliente",
          email: currentUser.email || "",
          role: "cliente",
          verificationStatus: "pendiente",
        });
      }
    } catch (error) {
      console.error("[v0] No se pudo cargar el perfil de Firebase:", error);
      setProfile({
        uid: currentUser.uid,
        name: currentUser.displayName || "Cliente",
        email: currentUser.email || "",
        role: "cliente",
        verificationStatus: "pendiente",
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      try {
        await loadProfile(nextUser);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      refreshProfile: () => loadProfile(user),
      logout: () => signOut(auth),
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return value;
}
