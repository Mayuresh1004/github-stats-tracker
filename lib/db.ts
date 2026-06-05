import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client"
const connectionString = `${process.env.DATABASE_URL}`;

const globalWithPrisma = global as typeof globalThis & { prisma?: PrismaClient }

const adapter = new PrismaPg({ connectionString });


if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({ adapter });
}

const prisma = globalWithPrisma.prisma

export { prisma }
