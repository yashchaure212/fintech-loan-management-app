import dotenv from "dotenv";
dotenv.config();

import prisma from "./config/prisma.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);
    process.exit(1);
  }
}

startServer();

import { hashPassword, comparePassword } from "./services/password.service.js";

async function testPassword() {
  const password = "Admin@123";

  const hashed = await hashPassword(password);

  console.log("Original :", password);
  console.log("Hashed   :", hashed);

  const match = await comparePassword(password, hashed);

  console.log("Matched :", match);
}

testPassword();

import {
  generateAccessToken,
  verifyAccessToken,
} from "./services/jwt.service.js";

function testJWT() {
  const payload = {
    id: "12345",
    role: "ADMIN",
    email: "admin@example.com",
  };

  const token = generateAccessToken(payload);

  console.log("\nGenerated Token:");
  console.log(token);

  const decoded = verifyAccessToken(token);

  console.log("\nDecoded Payload:");
  console.log(decoded);
}

testJWT();
