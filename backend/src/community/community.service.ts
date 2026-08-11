import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, CreateCommentDto, CreateGroupDto } from './community.dto';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async getPosts(groupId?: string) {
    return this.prisma.communityPost.findMany({
      where: groupId ? { groupId } : { groupId: null },
      include: {
        user: { include: { profile: true } },
        comments: {
          include: {
            user: { include: { profile: true } }
          },
          orderBy: { createdAt: 'asc' }
        },
        likes: true,
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPost(userId: string, dto: CreatePostDto) {
    return this.prisma.communityPost.create({
      data: { ...dto, userId },
      include: { user: { include: { profile: true } } },
    });
  }

  async createComment(userId: string, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: { content: dto.content, postId: dto.postId, userId },
      include: { user: { include: { profile: true } } },
    });
  }

  async toggleLike(userId: string, postId: string) {
    const existing = await this.prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existing) {
      await this.prisma.like.delete({ where: { postId_userId: { postId, userId } } });
      return { liked: false };
    }
    await this.prisma.like.create({ data: { postId, userId } });
    return { liked: true };
  }

  async getGroups() {
    return this.prisma.group.findMany({ include: { _count: { select: { posts: true } } } });
  }

  async createGroup(dto: CreateGroupDto) {
    return this.prisma.group.create({ data: dto });
  }
}
