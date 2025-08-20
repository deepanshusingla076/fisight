import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";

export const resetPassword = async (email) => {
  if (!email) throw new Error("Email is required for password reset");
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};
