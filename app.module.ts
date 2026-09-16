import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [AuthModule, UsersModule, ContentModule],
  controllers: [AppController]
})
export class AppModule {}
