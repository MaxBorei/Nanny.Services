import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  reload,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

import { useEffect, useState } from "react";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

const mapUser = (u: User): AuthUser => ({
  uid: u.uid,
  email: u.email,
  displayName: u.displayName,
});

export async function registerUser(p: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthUser> {
  const cred = await createUserWithEmailAndPassword(auth, p.email, p.password);

  const trimmed = p.name.trim();
  if (trimmed) {
    await updateProfile(cred.user, { displayName: trimmed });
    await reload(cred.user);
  }

  return mapUser(cred.user);
}

export async function loginUser(p: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const cred = await signInWithEmailAndPassword(auth, p.email, p.password);

  return mapUser(cred.user);
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeAuth(cb: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (u) => cb(u ? mapUser(u) : null));
}

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  return { user, isLoading };
}
