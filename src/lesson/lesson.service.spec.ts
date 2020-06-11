import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities';
import { LessonService } from './lesson.service';
import { mockLessonRepository } from './__mocks__/lesson.repository';
import { user, lesson, lessons, bookLessonDto } from '../__fixtures__';

describe('LessonService', () => {
  let lessonService: LessonService;
  let lessonRepository: Repository<Lesson>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonService,
        {
          provide: getRepositoryToken(Lesson),
          useFactory: mockLessonRepository,
        },
      ],
    }).compile();

    lessonService = module.get<LessonService>(LessonService);
    lessonRepository = module.get<Repository<Lesson>>(
      getRepositoryToken(Lesson),
    );
  });

  describe('create', () => {
    it('should create user', async () => {
      jest.spyOn(lessonRepository, 'save');

      expect(await lessonService.create(1, bookLessonDto)).toBe(lesson);
      expect(lessonRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should find all lessons', async () => {
      expect(await lessonService.findAll(1, user.role)).toBe(lessons);
      expect(lessonRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should find a lesson by id', async () => {
      expect(await lessonService.findOne(user.id, lesson.id)).toBe(lesson);
      expect(lessonRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw if lesson not found', () => {
      jest.spyOn(lessonRepository, 'findOne').mockResolvedValue(undefined);

      expect(lessonService.findOne(user.id, lesson.id)).rejects.toThrow(
        'Lesson not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete a lesson', async () => {
      jest.spyOn(lessonService, 'findOne');

      expect(await lessonService.delete(user.id, lesson.id)).toBe(lesson);
      expect(lessonService.findOne).toHaveBeenCalledTimes(1);
      expect(lessonRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
