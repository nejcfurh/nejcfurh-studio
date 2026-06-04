import { FirebaseError } from 'firebase/app';

const FIREBASE_AUTH_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'That email address is not valid.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/email-already-in-use': 'An account with that email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/too-many-requests':
    'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed':
    'Network error. Check your connection and try again.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.',
  'auth/popup-blocked':
    'The sign-in popup was blocked by the browser. Allow popups and try again.',
  'auth/account-exists-with-different-credential':
    'An account with that email exists with a different sign-in method.',
  'auth/requires-recent-login':
    'For security, please sign in again before changing your email.'
};

export const getFirebaseErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return (
      FIREBASE_AUTH_MESSAGES[error.code] ??
      'Something went wrong. Please try again.'
    );
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
};
