import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
console.log("No sample players are seeded; players authenticate through Telegram.");
prisma.$disconnect();
