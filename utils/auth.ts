import jwt from "jsonwebtoken";

export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    return jwt.decode(token); // Decodes without verifying
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};