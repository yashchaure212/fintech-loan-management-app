import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_ACCESS_SECRET: z.string().min(8, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(8, "JWT_REFRESH_SECRET is required"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().int().positive().optional().default(587),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  SMTP_FROM: z.string().optional().default(""),
  PAYMENTS_MODE: z.enum(["demo", "live"]).optional(),
  RAZORPAY_KEY_ID: z.string().optional().default(""),
  RAZORPAY_KEY_SECRET: z.string().optional().default(""),
  SEED_ADMIN_EMAIL: z.string().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
  SEED_ADMIN_PHONE: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  console.error("❌ Invalid environment configuration:\n" + issues);
  process.exit(1);
}

const env = parsed.data;

const placeholderSecrets = new Set([
  "accesssecret",
  "refreshsecret",
  "changeme",
  "secret",
]);

if (env.NODE_ENV === "production") {
  const secretsTooShort =
    env.JWT_ACCESS_SECRET.length < 32 || env.JWT_REFRESH_SECRET.length < 32;
  const secretsArePlaceholders =
    placeholderSecrets.has(env.JWT_ACCESS_SECRET.toLowerCase()) ||
    placeholderSecrets.has(env.JWT_REFRESH_SECRET.toLowerCase());

  if (secretsTooShort || secretsArePlaceholders) {
    console.error(
      "❌ JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be unique 32+ character values in production",
    );
    process.exit(1);
  }
}

export function isPaymentsDemo() {
  if (env.PAYMENTS_MODE) {
    return env.PAYMENTS_MODE === "demo";
  }

  return env.NODE_ENV !== "production";
}

export { env };
