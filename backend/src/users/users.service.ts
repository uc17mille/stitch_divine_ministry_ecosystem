import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, CreateUserDto } from './users.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, role?: Role, status?: string, page = 1, limit = 10) {
    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { profile: { firstName: { contains: search } } },
        { profile: { lastName: { contains: search } } }
      ];
    }
    if (role) {
      where.role = role;
    }
    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'suspended') {
      where.isActive = false;
    }

    const safeLimit = Math.max(1, Math.min(limit, 100));
    const safePage  = Math.max(1, page);
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          profile: true,
          onboardingDetails: true,
          assignedMentor: {
            include: { mentor: { include: { profile: true } } }
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit),
      limit: safeLimit,
    };
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash('Welcome@123', 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: dto.role,
        isActive: true,
        profile: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName
          }
        }
      },
      include: { profile: true }
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.role && { role: dto.role }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive })
      },
      include: { profile: true }
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.delete({ where: { id } });
  }

  async saveOnboardingDetails(userId: string, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const serializedData = typeof data === 'string' ? data : JSON.stringify(data);

    return this.prisma.onboardingDetails.upsert({
      where: { userId },
      update: { data: serializedData },
      create: { userId, data: serializedData }
    });
  }

  async getOnboardingDetails(userId: string) {
    const details = await this.prisma.onboardingDetails.findUnique({
      where: { userId }
    });
    if (!details) return null;
    try {
      return {
        ...details,
        data: JSON.parse(details.data)
      };
    } catch {
      return details;
    }
  }

  // ─── Mentor Assignment ────────────────────────────────────────────────────────

  async assignMentor(studentId: string, mentorId: string, type: string, note?: string) {
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student not found');
    const mentor = await this.prisma.user.findUnique({ where: { id: mentorId } });
    if (!mentor) throw new NotFoundException('Mentor not found');

    return this.prisma.mentorAssignment.upsert({
      where: { studentId },
      update: { mentorId, type, note },
      create: { studentId, mentorId, type, note },
      include: {
        mentor: { include: { profile: true } },
        student: { include: { profile: true } },
      },
    });
  }

  async unassignMentor(studentId: string) {
    const existing = await this.prisma.mentorAssignment.findUnique({ where: { studentId } });
    if (!existing) throw new NotFoundException('No assignment found for this student');
    return this.prisma.mentorAssignment.delete({ where: { studentId } });
  }

  async getAllAssignments() {
    return this.prisma.mentorAssignment.findMany({
      include: {
        mentor: { include: { profile: true } },
        student: { include: { profile: true } },
      },
      orderBy: { assignedAt: 'desc' },
    });
  }

  async getMentors() {
    return this.prisma.user.findMany({
      where: { role: 'MENTOR' },
      include: { profile: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ─── Student Progress Reports ──────────────────────────────────────────────────

  async recordProgressReport(mentorId: string, studentId: string, milestone: string, score: number, remarks: string, recommendation?: string) {
    const details = JSON.stringify({
      milestone,
      score,
      remarks,
      recommendation: recommendation || 'Standard Progress Update',
      recordedAt: new Date().toISOString(),
    });

    return this.prisma.auditLog.create({
      data: {
        userId: mentorId,
        action: 'MENTOR_PROGRESS_REPORT',
        entity: 'Student',
        entityId: studentId,
        details,
      },
      include: {
        user: { include: { profile: true } }
      }
    });
  }

  async getProgressReports(studentId?: string) {
    const where: any = { action: 'MENTOR_PROGRESS_REPORT' };
    if (studentId) where.entityId = studentId;
    
    return this.prisma.auditLog.findMany({
      where,
      include: {
        user: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
