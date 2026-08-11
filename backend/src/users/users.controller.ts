import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto, CreateUserDto } from './users.dto';
import { Role } from '@prisma/client';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('role') role?: Role,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usersService.findAll(
      search,
      role,
      status,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'Save onboarding details for current user' })
  @Post('onboarding')
  saveOnboarding(@Request() req: any, @Body() body: any) {
    return this.usersService.saveOnboardingDetails(req.user.userId, body);
  }

  @ApiOperation({ summary: 'Get onboarding details of a specific user' })
  @Get(':id/onboarding')
  getOnboarding(@Param('id') id: string) {
    return this.usersService.getOnboardingDetails(id);
  }

  // ─── Mentor Assignment Endpoints ───────────────────────────────────────────

  @ApiOperation({ summary: 'Get all users with role MENTOR' })
  @Get('mentors/list')
  getMentors() {
    return this.usersService.getMentors();
  }

  @ApiOperation({ summary: 'Get all mentor-student assignments' })
  @Get('assignments/all')
  getAllAssignments() {
    return this.usersService.getAllAssignments();
  }

  @ApiOperation({ summary: 'Assign a mentor to a student (Admin only)' })
  @Post('assign-mentor')
  assignMentor(@Body() body: { studentId: string; mentorId: string; type: string; note?: string }) {
    return this.usersService.assignMentor(body.studentId, body.mentorId, body.type, body.note);
  }

  @ApiOperation({ summary: 'Remove mentor assignment from a student (Admin only)' })
  @Delete(':studentId/assignment')
  unassignMentor(@Param('studentId') studentId: string) {
    return this.usersService.unassignMentor(studentId);
  }

  // ─── Student Progress Reports ───────────────────────────────────────────────

  @ApiOperation({ summary: 'Record student progress report (Mentor)' })
  @Post('progress-reports')
  recordProgressReport(@Body() body: { mentorId: string; studentId: string; milestone: string; score: number; remarks: string; recommendation?: string }) {
    return this.usersService.recordProgressReport(body.mentorId, body.studentId, body.milestone, body.score, body.remarks, body.recommendation);
  }

  @ApiOperation({ summary: 'Get student progress reports (Admin & Mentor)' })
  @Get('progress-reports')
  getProgressReports(@Query('studentId') studentId?: string) {
    return this.usersService.getProgressReports(studentId);
  }

  // ─── Standard CRUD ─────────────────────────────────────────────────────────

  @ApiOperation({ summary: 'Update user role or status' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
