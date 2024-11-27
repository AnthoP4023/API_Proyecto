import { config } from 'dotenv'
config()

export const BD_HOST = process.env.BD_HOST || "bagj6nszbcxpszkddt8q-mysql.services.clever-cloud.com";
export const BD_DATABASE = process.env.BD_DATABASE || "bagj6nszbcxpszkddt8q";
export const DB_USER = process.env.DB_USER || "u88eqx1skhlas9zw";
export const DB_PASSWORD = process.env.DB_PASSWORD || "WYWLNPQocszJoa8bIc7W";
export const DB_PORT = process.env.DB_PORT || 3306;
export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || "proyecto123";
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "img_proyecto";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "643144616894173";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "BN1IGzGDdvOOUcUwEWiSMy6dTrA";
