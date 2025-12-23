import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "./prisma"

// Ensure baseURL is always a valid URL
const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:5000";

// Remove trailing slash if present
const cleanBaseURL = baseURL.replace(/\/$/, '');

console.log('Better Auth baseURL:', cleanBaseURL); // Debug log

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql'
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    secret: process.env.BETTER_AUTH_SECRET as string,
    baseURL: cleanBaseURL,
    basePath: "/api/auth",
});