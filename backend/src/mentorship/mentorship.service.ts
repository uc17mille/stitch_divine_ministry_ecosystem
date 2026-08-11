import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackDto, CreateBookingDto } from './mentorship.dto';

@Injectable()
export class MentorshipService {
  constructor(private prisma: PrismaService) {}

  async getMentors() {
    return this.prisma.user.findMany({
      where: { role: 'MENTOR' },
      include: { profile: true, mentorshipTracks: true },
    });
  }

  async getTracks(mentorId?: string) {
    return this.prisma.mentorshipTrack.findMany({
      where: mentorId ? { mentorId } : undefined,
      include: { mentor: { include: { profile: true } } },
    });
  }

  async createTrack(mentorId: string, dto: CreateTrackDto) {
    return this.prisma.mentorshipTrack.create({ data: { ...dto, mentorId } });
  }

  async createBooking(studentId: string, dto: CreateBookingDto) {
    return this.prisma.booking.create({
      data: {
        trackId: dto.trackId,
        mentorId: dto.mentorId,
        studentId,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
      },
      include: { track: true, mentor: { include: { profile: true } } },
    });
  }

  async getMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { OR: [{ studentId: userId }, { mentorId: userId }] },
      include: {
        track: true,
        student: { include: { profile: true } },
        mentor: { include: { profile: true } },
      },
      orderBy: { startTime: 'asc' },
    });
  }
}
