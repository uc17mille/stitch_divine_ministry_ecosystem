import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.globalSettings.findUnique({
      where: { id: 'singleton' }
    });

    if (!settings) {
      settings = await this.prisma.globalSettings.create({
        data: { id: 'singleton' }
      });
    }

    return settings;
  }

  async updateSettings(data: any) {
    return this.prisma.globalSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data }
    });
  }
}
