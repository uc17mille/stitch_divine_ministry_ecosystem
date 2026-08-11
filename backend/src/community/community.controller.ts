import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommunityService } from './community.service';
import { CreatePostDto, CreateCommentDto, CreateGroupDto } from './community.dto';

@ApiTags('community')
@Controller('community')
@ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get('posts') getPosts(@Query('groupId') groupId?: string) { return this.communityService.getPosts(groupId); }
  @Post('posts') createPost(@Request() req: any, @Body() dto: CreatePostDto) { return this.communityService.createPost(req.user.userId, dto); }
  @Post('comments') createComment(@Request() req: any, @Body() dto: CreateCommentDto) { return this.communityService.createComment(req.user.userId, dto); }
  @Post('posts/:postId/like') toggleLike(@Param('postId') postId: string, @Request() req: any) { return this.communityService.toggleLike(req.user.userId, postId); }
  @Get('groups') getGroups() { return this.communityService.getGroups(); }
  @Post('groups') createGroup(@Body() dto: CreateGroupDto) { return this.communityService.createGroup(dto); }
}
