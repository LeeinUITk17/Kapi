import { Injectable, NotFoundException } from '@nestjs/common';
import { Course, Lesson } from '@prisma/client';
import { CreateCourseDto, UpdateCourseDto } from 'src/dto/courseDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}
  async getCourses(userId: string): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: {
        createdById: userId,
      },
      include: {
        lessons: true,
      },
    });
  }
  async getCourseDetails(id: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        lessons: true,
        createdBy: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }
  async getLessonsByCourseId(id: string): Promise<Lesson[]> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        lessons: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course.lessons;
  }
  async createCourse(createCourse: CreateCourseDto) {
    return this.prisma.course.create({
      data: createCourse,
    });
  }
  async updateCourse(id: string, updateCourse: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { id },
      data: updateCourse,
    });
  }
  async deleteCourse(id: string) {
    return this.prisma.course.delete({
      where: { id },
    });
  }
}
