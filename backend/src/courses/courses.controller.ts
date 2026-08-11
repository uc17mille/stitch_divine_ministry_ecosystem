import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CoursesService } from './courses.service';
import { CreateCourseDto, CreateModuleDto, CreateLessonDto, CreateEnrollmentDto, UpdateLessonProgressDto } from './courses.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @ApiOperation({ summary: 'Get all courses' })
  @Get()
  findAll(@Query('search') search?: string) {
    return this.coursesService.findAll(search);
  }

  @ApiOperation({ summary: 'Get all course categories' })
  @Get('categories')
  findCategories() {
    return this.coursesService.findCategories();
  }

  @ApiOperation({ summary: 'Get a single course with modules and lessons' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }


  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a course (Instructor/Admin)' })
  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Post('modules')
  createModule(@Body() dto: CreateModuleDto) {
    return this.coursesService.createModule(dto);
  }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Post('lessons')
  createLesson(@Body() dto: CreateLessonDto) {
    return this.coursesService.createLesson(dto);
  }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Post('enroll')
  enroll(@Request() req: any, @Body() dto: CreateEnrollmentDto) {
    return this.coursesService.enroll(req.user.userId, dto);
  }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Get('my/enrollments')
  getMyEnrollments(@Request() req: any) {
    return this.coursesService.getMyEnrollments(req.user.userId);
  }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Post('progress')
  updateProgress(@Request() req: any, @Body() dto: UpdateLessonProgressDto) {
    return this.coursesService.updateProgress(req.user.userId, dto);
  }
}
