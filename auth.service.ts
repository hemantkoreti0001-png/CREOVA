import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(email: string, password: string, displayName: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException('Email already registered');
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({
      data: { email, passwordHash, displayName, profile: { create: {} } },
      select: { id: true, email: true, displayName: true, role: true }
    });
    return { user, accessToken: this.sign(user.id, user.email, user.role) };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return {
      user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role },
      accessToken: this.sign(user.id, user.email, user.role)
    };
  }

  private sign(id: string, email: string, role: string) {
    return this.jwt.sign({ sub: id, email, role });
  }
}
