// @ts-nocheck
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

export const setupRecaptcha = (containerId: string) => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
    window.recaptchaVerifier = null;
  }
  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    containerId,
    { size: "invisible" }
  );
  return window.recaptchaVerifier;
};

// Send OTP to phone number
export const sendOTP = async (phoneNumber: string) => {
  const appVerifier = window.recaptchaVerifier;
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    appVerifier
  );
  window.confirmationResult = confirmationResult;
  return confirmationResult;
};

// Verify OTP entered by user
export const verifyOTP = async (otp: string) => {
  const result = await window.confirmationResult.confirm(otp);
  return result.user;
};

// Logout
export const logoutUser = async () => {
  await signOut(auth);
};

// Listen to auth state changes
export const onAuthChange = (callback: any) => {
  return onAuthStateChanged(auth, callback);
};