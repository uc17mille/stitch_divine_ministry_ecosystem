import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, CreateModuleDto, CreateLessonDto, CreateEnrollmentDto, UpdateLessonProgressDto } from './courses.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  // ---- Courses ----
  async findAll(search?: string) {
    return this.prisma.course.findMany({
      where: search ? { title: { contains: search } } : undefined,
      include: {
        category: true,
        modules: {
          select: {
            _count: {
              select: { lessons: true }
            }
          }
        },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findCategories() {
    return this.prisma.courseCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        category: true,
        modules: {
          orderBy: { orderIndex: 'asc' },
          include: { 
            lessons: { 
              orderBy: { orderIndex: 'asc' },
              include: { video: true, audio: true, books: true, quizzes: true }
            } 
          },
        },
      },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async create(dto: CreateCourseDto) {
    const { modules, ...courseData } = dto;
    return this.prisma.course.create({
      data: {
        ...courseData,
        modules: modules ? {
          create: modules.map((mod: any, mIdx: number) => ({
            title: mod.title,
            description: mod.description || '',
            orderIndex: mIdx + 1,
            lessons: mod.lessons ? {
              create: mod.lessons.map((les: any, lIdx: number) => ({
                title: les.title,
                content: les.content || '',
                orderIndex: lIdx + 1,
                video: les.videoUrl ? {
                  create: {
                    url: les.videoUrl,
                  }
                } : undefined,
                audio: les.audioUrl ? {
                  create: {
                    url: les.audioUrl,
                  }
                } : undefined,
                resources: les.resources ? {
                  create: les.resources.create
                } : undefined,
                books: les.books ? {
                  create: les.books.create
                } : undefined,
                quizzes: les.quizzes ? {
                  create: les.quizzes.create
                } : undefined,
              }))
            } : undefined,
          }))
        } : undefined,
      },
      include: {
        category: true,
        modules: {
          include: {
            lessons: {
              include: {
                video: true,
                audio: true,
              }
            }
          }
        }
      }
    });
  }

  // ---- Modules ----
  async createModule(dto: CreateModuleDto) {
    return this.prisma.module.create({ data: dto });
  }

  // ---- Lessons ----
  async createLesson(dto: CreateLessonDto) {
    return this.prisma.lesson.create({ data: dto });
  }

  // ---- Enrollments ----
  async enroll(userId: string, dto: CreateEnrollmentDto) {
    const existing = await this.prisma.enrollment.findFirst({
      where: { userId, courseId: dto.courseId },
    });
    if (existing) return existing;
    return this.prisma.enrollment.create({
      data: { userId, courseId: dto.courseId, progress: { create: {} } },
      include: { progress: true },
    });
  }

  async getMyEnrollments(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: { course: { include: { category: true } }, progress: true },
    });
  }

  // ---- Progress ----
  async updateProgress(userId: string, dto: UpdateLessonProgressDto) {
    return this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: dto.lessonId } },
      update: { isCompleted: true, lastPosition: dto.lastPosition, updatedAt: new Date() },
      create: { userId, lessonId: dto.lessonId, isCompleted: true, lastPosition: dto.lastPosition },
    });
  }
}
