'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

/**
 * Initializes the Firebase Client SDK.
 * Note: App Check enforcement must be disabled for Authentication in the 
 * Firebase Console to avoid "invalid-app-check-token" errors in this environment.
 */
export function initializeFirebase() {
  const isNewApp = getApps().length === 0;
  const app = isNewApp ? initializeApp(firebaseConfig) : getApp();

  if (isNewApp && typeof window !== 'undefined') {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6LfC7EwtAAAAAF5eoM-Tv7Af543QJcS37IJa5CUy'),
      isTokenAutoRefreshEnabled: true
    });
  }

  return getSdks(app);
}

/**
 * Returns the initialized Firebase SDK instances.
 */
export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
