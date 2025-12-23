import dotenv from "dotenv"
dotenv.config();



// Server configuration
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

// Google OAuth configuration
export const GOOGLE_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackUrl: process.env.GOOGLE_CALLBACK_URL,
};

// Better Auth
export const BETTER_AUTH_CONFIG = {
  secret: process.env.BETTER_AUTH_SECRET,
  url: process.env.BETTER_AUTH_URL,
};