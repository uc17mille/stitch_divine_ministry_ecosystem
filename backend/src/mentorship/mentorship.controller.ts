import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MentorshipService } from './mentorship.service';
import { CreateTrackDto, CreateBookingDto } from './mentorship.dto';

@ApiTags('mentorship')
@Controller('mentorship')
export class MentorshipController {
  constructor(private mentorshipService: MentorshipService) {}

  @Get('mentors') getMentors() { return this.mentorshipService.getMentors(); }
  @Get('tracks') getTracks(@Query('mentorId') mentorId?: string) { return this.mentorshipService.getTracks(mentorId); }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Post('tracks') createTrack(@Request() req: any, @Body() dto: CreateTrackDto) { return this.mentorshipService.createTrack(req.user.userId, dto); }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Post('book') book(@Request() req: any, @Body() dto: CreateBookingDto) { return this.mentorshipService.createBooking(req.user.userId, dto); }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Get('my/bookings') getMyBookings(@Request() req: any) { return this.mentorshipService.getMyBookings(req.user.userId); }
}
