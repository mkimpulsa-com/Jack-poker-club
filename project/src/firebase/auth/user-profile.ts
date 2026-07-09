'use client';

import {
  doc,
  setDoc,
  serverTimestamp,
  type Firestore,
  type User,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Crea o actualiza el perfil de un usuario en Firestore de forma segura.
 * 
 * @param user Instancia del usuario de Firebase Auth.
 * @param firestore Instancia de Firestore.
 * @param additionalData Datos adicionales (como playerId o whatsappNumber).
 * @param isNewUser Si es verdadero, inicializa campos de registro como createdAt y hasSchoolAccess.
 */
export function saveUserProfile(
  user: User,
  firestore: Firestore,
  additionalData: Record<string, any> = {},
  isNewUser: boolean = false
) {
  if (!user) return;

  const userRef = doc(firestore, 'users', user.uid);
  
  const profileData: any = {
    email: user.email,
    updatedAt: serverTimestamp(),
    ...additionalData,
  };

  if (user.displayName) {
    profileData.displayName = user.displayName;
  }
  
  if (user.photoURL) {
    profileData.profilePictureUrl = user.photoURL;
  }

  // Inicialización de campos críticos solo si es un usuario nuevo
  if (isNewUser) {
      profileData.createdAt = serverTimestamp();
      // Solo establecemos hasSchoolAccess si no viene ya en additionalData
      if (profileData.hasSchoolAccess === undefined) {
        profileData.hasSchoolAccess = false;
      }
  }

  // Usamos merge: true para no sobrescribir datos existentes que no estemos enviando ahora
  setDoc(userRef, profileData, { merge: true })
    .catch((error) => {
      const contextualError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'write',
        requestResourceData: profileData,
      });
      errorEmitter.emit('permission-error', contextualError);
    });
}
