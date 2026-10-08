import { PrismaClient } from '@prisma/client';

// Users reach client components and Pusher payloads, so the hash is omitted
// from every query; auth.ts opts back in for the credentials check.
export const createPrismaClient = (datasourceUrl?: string) =>
  new PrismaClient({ datasourceUrl, omit: { user: { hashedPassword: true } } });

type PrismaClientWithOmit = ReturnType<typeof createPrismaClient>;

declare global {
  var prisma: PrismaClientWithOmit | undefined;
}

const client = globalThis.prisma || createPrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = client;
}

export default client;
