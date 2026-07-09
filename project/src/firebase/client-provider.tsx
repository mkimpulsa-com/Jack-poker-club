'use client';

import React, { useMemo, type ReactNode, useEffect } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { getRedirectResult } from 'firebase/auth';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle redirect result on every page load
  useEffect(() => {
    if (firebaseServices.auth) {
      getRedirectResult(firebaseServices.auth)
        .then((result) => {
          // The onAuthStateChanged observer will handle the user session persistence.
          // This is primarily to catch errors from the redirect flow.
          if (result) {
             // User signed in. onAuthStateChanged will handle the rest.
          }
        })
        .catch((error) => {
          console.error("Error handling redirect result:", error);
          // Optionally, show a toast notification to the user here.
        });
    }
  }, [firebaseServices.auth]);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
