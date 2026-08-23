import { env } from "./config/env.js";
import app from "./app.js";
import prisma from "./config/prisma.js";

const PORT = env.PORT;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n⚠️ ${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        console.log("🛑 HTTP server closed");

        await prisma.$disconnect();

        console.log("🔌 Database disconnected");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);

    await prisma.$disconnect();

    process.exit(1);
  }
};

startServer();
