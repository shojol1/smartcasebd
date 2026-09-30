import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// On Vercel Serverless Functions, copy SQLite dev.db to writable /tmp directory
if (process.env.VERCEL || process.env.NODE_ENV === "production") {
  try {
    const tmpDbPath = process.env.VERCEL
      ? path.join("/tmp", "dev.db")
      : path.join(process.cwd(), "prisma", "dev.db");

    if (process.env.VERCEL) {
      const localDbPath = path.join(process.cwd(), "prisma", "dev.db");
      const rootDbPath = path.join(process.cwd(), "dev.db");

      if (!fs.existsSync(tmpDbPath)) {
        const dir = path.dirname(tmpDbPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        if (fs.existsSync(localDbPath)) {
          fs.copyFileSync(localDbPath, tmpDbPath);
        } else if (fs.existsSync(rootDbPath)) {
          fs.copyFileSync(rootDbPath, tmpDbPath);
        }
      }

      if (fs.existsSync(tmpDbPath)) {
        process.env.DATABASE_URL = `file:${tmpDbPath}`;
      }
    }
  } catch (err) {
    console.error("Vercel SQLite tmp copy warning:", err);
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
