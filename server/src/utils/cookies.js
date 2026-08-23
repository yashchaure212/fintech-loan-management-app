import { env } from "../config/env.js";
import { parseDurationToMs } from "./date.util.js";

const REFRESH_COOKIE = "refreshToken";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function cookieOptions() {
  const isProduction = env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "lax" : "lax",
    path: "/api/v1/auth",
    maxAge: parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN, SEVEN_DAYS_MS),
  };
}
export function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE, token, cookieOptions());
}

export function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE, cookieOptions());
}

export function readRefreshToken(req) {
  return req.cookies?.[REFRESH_COOKIE] || req.body?.refreshToken || null;
}
