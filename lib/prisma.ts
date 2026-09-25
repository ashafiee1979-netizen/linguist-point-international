// Safe resilient Prisma loader for serverless and development environments

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: any | undefined;
}

function createPrismaClient(): any | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    // Dynamically require so module loading never throws if .prisma/client is not yet generated
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("@prisma/client");
    const client =
      global.__prismaClient ??
      new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      });

    if (process.env.NODE_ENV !== "production") {
      global.__prismaClient = client;
    }
    return client;
  } catch (error) {
    console.warn("Prisma Client unavailable (database url provided but client not generated):", error);
    return null;
  }
}

export const prisma = createPrismaClient();
