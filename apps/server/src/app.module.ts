/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { CourseModule } from './module/courses/course.module';
import { CloudinaryModule } from './module/cloudinary/cloudinary.module';
import { LessonModule } from './module/lesson/lesson.module';
import { NotificationsModule } from './module/notification/notification.module';
import { HealthModule } from './module/healthy/healthy.module';
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    CourseModule,
    LessonModule,
    HealthModule,
    NotificationsModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
