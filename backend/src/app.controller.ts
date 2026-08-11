import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('seed')
  async triggerSeed() {
    try {
      await this.prisma.autoSeed();
      const count = await this.prisma.user.count();
      const users = await this.prisma.user.findMany({
        select: { id: true, email: true, role: true, createdAt: true },
      });
      return {
        status: 'success',
        message: 'Database seeded successfully!',
        totalUsers: count,
        users,
      };
    } catch (err: any) {
      return {
        status: 'error',
        message: err.message || 'Seeding failed',
      };
    }
  }

  @Get('health')
  async checkHealth() {
    try {
      const userCount = await this.prisma.user.count();
      return {
        status: 'healthy',
        databaseConnected: true,
        userCount,
      };
    } catch (err: any) {
      return {
        status: 'unhealthy',
        databaseConnected: false,
        error: err.message,
      };
    }
  }
}
