import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, displayName: true, role: true, createdAt: true,
        profile: true,
        _count: { select: { posts: true, videos: true, tribeOwned: true } }
      }
    });
  }
}
