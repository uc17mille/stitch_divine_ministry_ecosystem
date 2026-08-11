import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './events.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: { startTime: 'asc' },
      include: { _count: { select: { registrations: true } } },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id }, include: { _count: { select: { registrations: true } } } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(dto: CreateEventDto) {
    return this.prisma.event.create({ data: { ...dto, startTime: new Date(dto.startTime), endTime: new Date(dto.endTime) } });
  }

  async register(eventId: string, userId: string) {
    const event = await this.findOne(eventId);
    if (event.capacity && (event as any)._count.registrations >= event.capacity) {
      throw new BadRequestException('Event is at full capacity');
    }
    return this.prisma.eventRegistration.upsert({
      where: { eventId_userId: { eventId, userId } },
      update: {},
      create: { eventId, userId },
    });
  }

  async getMyRegistrations(userId: string) {
    return this.prisma.eventRegistration.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { registeredAt: 'desc' },
    });
  }
}
