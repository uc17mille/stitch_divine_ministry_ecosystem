import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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
    await this.autoSeed();
  }

  private async autoSeed() {
    try {
      const userCount = await this.user.count();
      if (userCount === 0) {
        console.log('🌱 Empty database detected! Auto-seeding default demo accounts...');

        const adminHash = await bcrypt.hash('Admin@12345', 12);
        await this.user.create({
          data: {
            email: 'admin@auramini.com',
            passwordHash: adminHash,
            role: 'ADMINISTRATOR',
            profile: { create: { firstName: 'Aura', lastName: 'Admin', bio: 'Platform administrator' } },
          },
        });

        const mentorHash = await bcrypt.hash('Mentor@12345', 12);
        await this.user.create({
          data: {
            email: 'mentor@auramini.com',
            passwordHash: mentorHash,
            role: 'MENTOR',
            profile: { create: { firstName: 'Dr. Elias', lastName: 'Thorne', bio: 'Senior pastor and leadership coach' } },
          },
        });

        const studentHash = await bcrypt.hash('Student@12345', 12);
        await this.user.create({
          data: {
            email: 'student@auramini.com',
            passwordHash: studentHash,
            role: 'STUDENT',
            profile: { create: { firstName: 'Grace', lastName: 'Adeyemi' } },
          },
        });

        // Default categories
        await this.courseCategory.upsert({ where: { name: 'Leadership' }, update: {}, create: { name: 'Leadership', description: 'Ministry leadership courses' } });
        await this.courseCategory.upsert({ where: { name: 'Theology' }, update: {}, create: { name: 'Theology', description: 'Biblical theology courses' } });
        await this.prayerCategory.upsert({ where: { name: 'Health & Healing' }, update: {}, create: { name: 'Health & Healing' } });
        await this.prayerCategory.upsert({ where: { name: 'Spiritual Growth' }, update: {}, create: { name: 'Spiritual Growth' } });

        console.log('✅ Auto-seed completed! Accounts: admin@auramini.com, mentor@auramini.com, student@auramini.com');
      }
    } catch (err) {
      console.error('Auto-seed error:', err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

