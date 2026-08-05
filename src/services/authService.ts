// @ts-nocheck
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

export const setupRecaptcha = () => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
    window.recaptchaVerifier = null;
  }
  window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
    callback: () => {},
  });
};

export const sendOTP = async (phoneNumber) => {
  setupRecaptcha();
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    window.recaptchaVerifier
  );
  window.confirmationResult = confirmationResult;
  return confirmationResult;
};

export const verifyOTP = async (otp) => {
  const result = await window.confirmationResult.confirm(otp);
  return result.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};