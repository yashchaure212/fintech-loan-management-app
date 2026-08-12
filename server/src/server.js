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
