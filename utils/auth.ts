import jwt from "jsonwebtoken";

export const decodeToken = (token: string) => {
  if (!token) return null;
  
  try {
    return jwt.decode(token); // Decodes without verifying
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};