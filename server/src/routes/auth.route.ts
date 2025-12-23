import { Router } from "express"
import { upsertUser } from "@/controller/auth.controller"

const router = Router();

// Endpoint for frontend to send Better-Auth user info
router.post('/upsert',upsertUser)


export default router;