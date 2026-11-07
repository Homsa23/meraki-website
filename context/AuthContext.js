"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  getFirebaseAuth,
  getFirebaseConfigIssue,
  isFirebaseConfigured,
} from "@/lib/firebase";

const AuthContext = createContext(null);

const AUTH_ERROR_MESSAGES = {
  "auth/invalid-email": "Enter a valid email address.",
  "auth/missing-email": "Enter your email address.",
  "auth/missing-password": "Enter your password.",
  "auth/weak-password": "Use at least 6 characters for your password.",
  "auth/email-already-in-use": "That email is already registered. Sign in instead.",
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/wrong-password": "Email or password is incorrect.",
  "auth/user-not-found": "No account found for that email.",
  "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
  "auth/popup-closed-by-user": "Google sign-in was closed before it finished.",
  "auth/popup-blocked": "Your browser blocked the Google popup. Allow popups and retry.",
  "auth/cancelled-popup-request": "Another sign-in attempt is already in progress.",
  "auth/invalid-phone-number": "Use an international number, e.g. +233 24 000 0000.",
  "auth/invalid-verification-code": "That verification code is not valid.",
  "auth/missing-verification-code": "Enter the code sent to your phone.",
  "auth/code-expired": "That code expired. Request a new one.",
  "auth/operation-not-allowed": "This sign-in method is not enabled in Firebase Console.",
  "auth/unauthorized-domain": "This domain is not authorised in Firebase Console.",
  "auth/network-request-failed": "Network error. Check your connection and retry.",
  "auth/recaptcha-not-enabled": "Phone verification is not enabled in Firebase Console.",
  "auth/invalid-app-credential": "Phone verification failed. Refresh and try again.",
  "auth/billing-not-enabled": "Phone sign-in requires Firebase billing to be enabled.",
};

/** Map Firebase error codes to short, brand-appropriate copy. */
export function friendlyAuthError(error) {
  const code = error?.code;
  if (code && AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code];
  return error?.message?.replace(/^Firebase:\s*/i, "") || "Something went wrong. Try again.";
}

/** Serializable subset of the Firebase user — safe to render. */
function toSessionUser(firebaseUser) {
  if (!firebaseUser) return null;

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? null,
    phoneNumber: firebaseUser.phoneNumber ?? null,
    displayName: firebaseUser.displayName ?? null,
    photoURL: firebaseUser.photoURL ?? null,
    emailVerified: firebaseUser.emailVerified === true,
    providerId: firebaseUser.providerData?.[0]?.providerId ?? null,
  };
}

export function AuthProvider({ children }) {
  const configured = isFirebaseConfigured();
  const configIssue = getFirebaseConfigIssue();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(configured);

  const syncUser = useCallback((firebaseUser) => {
    setUser(toSessionUser(firebaseUser));
  }, []);

  useEffect(() => {
    if (!configured) {
      return undefined;
    }

    let unsubscribe = () => {};

    try {
      unsubscribe = onAuthStateChanged(
        getFirebaseAuth(),
        (firebaseUser) => {
          syncUser(firebaseUser);
          setLoading(false);
        },
        () => {
          // Invalid key / offline — stop waiting and let the UI recover.
          setLoading(false);
        }
      );
    } catch {
      // The config passed validation but the SDK rejected it — stop the
      // loading state on the next tick without a synchronous effect update.
      queueMicrotask(() => setLoading(false));
    }

    return () => unsubscribe();
  }, [configured, syncUser]);

  const signInWithEmail = useCallback(async (email, password) => {
    const credential = await signInWithEmailAndPassword(
      getFirebaseAuth(),
      email.trim(),
      password
    );
    syncUser(credential.user);
    return credential.user;
  }, [syncUser]);

  const signUpWithEmail = useCallback(async (name, email, password) => {
    const auth = getFirebaseAuth();
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    if (name?.trim()) {
      await updateProfile(credential.user, { displayName: name.trim() });
    }

    syncUser(auth.currentUser ?? credential.user);
    return credential.user;
  }, [syncUser]);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const credential = await signInWithPopup(getFirebaseAuth(), provider);
    syncUser(credential.user);
    return credential.user;
  }, [syncUser]);

  /** Begin phone auth. `verifier` is a RecaptchaVerifier created by the UI. */
  const sendPhoneCode = useCallback(async (phoneNumber, verifier) => {
    return signInWithPhoneNumber(
      getFirebaseAuth(),
      phoneNumber.trim(),
      verifier
    );
  }, []);

  /** Complete phone auth with the SMS code. */
  const confirmPhoneCode = useCallback(async (confirmationResult, code) => {
    const credential = await confirmationResult.confirm(code.trim());
    syncUser(credential.user);
    return credential.user;
  }, [syncUser]);

  const signOutUser = useCallback(async () => {
    if (!configured) return;
    await signOut(getFirebaseAuth());
    setUser(null);
  }, [configured]);

  const value = useMemo(
    () => ({
      user,
      loading,
      configured,
      configIssue,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      sendPhoneCode,
      confirmPhoneCode,
      signOutUser,
    }),
    [
      user,
      loading,
      configured,
      configIssue,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      sendPhoneCode,
      confirmPhoneCode,
      signOutUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>.");
  }

  return context;
};
