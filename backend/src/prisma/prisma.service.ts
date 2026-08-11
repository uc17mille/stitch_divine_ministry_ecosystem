import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({});
  }
  async onModuleInit() {
    await this.$connect();
    try {
      await this.$executeRawUnsafe(`PRAGMA journal_mode = WAL;`);
      await this.$executeRawUnsafe(`PRAGMA synchronous = NORMAL;`);
      await this.$executeRawUnsafe(`PRAGMA cache_size = 10000;`);
    } catch {
      // Ignored if non-sqlite
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
