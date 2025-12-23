// src/middlewares/upload.ts
import multer, { FileFilterCallback } from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Request } from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export const upload = multer({
  storage: multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb) => cb(null, uploadDir),
    filename: (_req: Request, file: Express.Multer.File, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  }),
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) =>
    cb(null, file.mimetype.startsWith('image/')),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
