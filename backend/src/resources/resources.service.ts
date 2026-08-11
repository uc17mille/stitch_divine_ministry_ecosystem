import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.resourceLibrary.findMany({
      where: search ? { title: { contains: search } } : undefined,
      include: { _count: { select: { downloads: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async recordDownload(userId: string, resourceId: string) {
    return this.prisma.download.create({ data: { userId, resourceId } });
  }

  async create(data: { title: string; description?: string; url: string }) {
    return this.prisma.resourceLibrary.create({ data });
  }
}
