import { Body, Controller, Get, Param, Post as HttpPost, Query } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller()
export class ContentController {
  constructor(private prisma: PrismaService) {}

  @Get('feed')
  feed(@Query('limit') limit = '20') {
    return this.prisma.video.findMany({
      take: Math.min(Math.max(Number(limit) || 20, 1), 50),
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, displayName: true } } }
    });
  }

  @HttpPost('videos')
  createVideo(@Body() body: {
    userId: string; title: string; description?: string;
    type?: string; videoUrl: string; thumbnailUrl?: string;
  }) {
    return this.prisma.video.create({
      data: {
        userId: body.userId, title: body.title, description: body.description,
        type: body.type || 'long', videoUrl: body.videoUrl, thumbnailUrl: body.thumbnailUrl
      }
    });
  }

  @HttpPost('videos/:id/view')
  async view(@Param('id') id: string) {
    return this.prisma.video.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: { id: true, views: true }
    });
  }

  @HttpPost('posts')
  createPost(@Body() body: { userId: string; title: string; body?: string }) {
    return this.prisma.post.create({ data: body });
  }
}
