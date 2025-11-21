// lib/http.ts
import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_BASE;

export const client = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
