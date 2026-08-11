import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrayerRequestDto, CreatePrayerCategoryDto } from './prayer.dto';

@Injectable()
export class PrayerService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    return this.prisma.prayerCategory.findMany();
  }

  async createCategory(dto: CreatePrayerCategoryDto) {
    return this.prisma.prayerCategory.create({ data: dto });
  }

  async getRequests(userId: string) {
    return this.prisma.prayerRequest.findMany({
      where: { OR: [{ isPrivate: false }, { userId }] },
      include: { user: { include: { profile: true } }, category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRequest(userId: string, dto: CreatePrayerRequestDto) {
    return this.prisma.prayerRequest.create({
      data: { ...dto, userId },
      include: { user: { include: { profile: true } }, category: true },
    });
  }

  async deleteRequest(id: string, userId: string) {
    const req = await this.prisma.prayerRequest.findUnique({ where: { id } });
    if (!req) throw new NotFoundException('Prayer request not found');
    if (req.userId !== userId) throw new NotFoundException('Not authorized');
    return this.prisma.prayerRequest.delete({ where: { id } });
  }
}
