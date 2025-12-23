import { Request, Response } from 'express';
import prisma from "@/lib/prisma"

export const upsertUser = async (req: Request, res: Response) => {
    const { email, username, name, image, googleId } = req.body;

    // Validate all required fields
    if (!email || !googleId || !username) {
        return res.status(400).json({ 
            error: 'Email, username, and googleId are required' 
        });
    }

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: { 
                username, 
                name, 
                image, 
                googleId 
            },
            create: {
                email, 
                username, 
                name, 
                image, 
                googleId
            }
        });
        res.json(user);
    } catch (error: any) {
        // Log the full error for debugging
        console.error('Prisma error:', error);
        res.status(500).json({ 
            error: 'Failed to upsert user',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}