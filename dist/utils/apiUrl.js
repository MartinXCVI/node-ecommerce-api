/* MODULES IMPORTS */
import dotenv from 'dotenv';
// Making environment variables available
dotenv.config();
// API URL defined
export const apiUrl = process.env.API_URL ?? (() => {
    throw new Error("API_URL is not defined in environment variables");
})(); // <-- IIFE (Immediately invoked function expression
