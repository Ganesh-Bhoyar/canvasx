import { PrismaClient } from './src/generated/prisma/index.js';

const client = new PrismaClient();

export default client;
export {Prisma} from './src/generated/prisma/index.js';