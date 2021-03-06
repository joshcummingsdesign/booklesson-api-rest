import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';
import { ERole } from '../role/entities';
import { UserService } from './user.service';
import { CryptoService } from '../crypto/crypto.service';
import { InstrumentService } from '../instrument/instrument.service';
import { RoleService } from '../role/role.service';
import { mockUserRepository } from './__mocks__/user.repository';
import { mockCryptoService } from '../crypto/__mocks__/crypto.service';
import { mockInstrumentService } from '../instrument/__mocks__/instrument.service';
import { mockRoleService } from '../role/__mocks__/role.service';
import {
  createUserDto,
  updateUserDto,
  auth,
  users,
  student,
  teachers,
  students,
} from '../__fixtures__';
import { AuthService } from '../auth/auth.service';
import { mockAuthService } from '../auth/__mocks__/auth.service';

describe('UserService', () => {
  let userRepository: Repository<User>;
  let userService: UserService;
  let authService: AuthService;
  let cryptoService: CryptoService;
  let instrumentService: InstrumentService;
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        { provide: AuthService, useFactory: mockAuthService },
        { provide: CryptoService, useFactory: mockCryptoService },
        { provide: InstrumentService, useFactory: mockInstrumentService },
        { provide: RoleService, useFactory: mockRoleService },
      ],
    }).compile();

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    cryptoService = module.get<CryptoService>(CryptoService);
    instrumentService = module.get<InstrumentService>(InstrumentService);
    roleService = module.get<RoleService>(RoleService);
  });

  describe('create', () => {
    it('should create user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      expect(await userService.create(createUserDto)).toBe(student);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(cryptoService.hashPassword).toHaveBeenCalledWith(auth.password);
      expect(authService.create).toHaveBeenCalledTimes(1);
      expect(instrumentService.findByName).toHaveBeenCalledTimes(1);
      expect(roleService.findByName).toHaveBeenCalledTimes(1);
    });

    it('should throw if user exists', () => {
      expect(userService.create(createUserDto)).rejects.toThrow(
        'User email already exists',
      );
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      expect(await userService.findAll()).toBe(users);
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should find all teachers', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue(teachers as User[]);

      expect(await userService.findAll(ERole.teacher)).toBe(teachers);
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should find all students', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue(students as User[]);

      expect(await userService.findAll(ERole.student)).toBe(students);
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      expect(await userService.findOne(student.id)).toBe(student);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw if user not found', () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      expect(userService.findOne(student.id)).rejects.toThrow('User not found');
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      expect(await userService.findByEmail(student.email)).toBe(student);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw if user not found', () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      expect(userService.findByEmail(student.email)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      jest.spyOn(userService, 'findOne');

      expect(await userService.update(student.id, updateUserDto)).toMatchObject(
        student,
      );
      expect(userService.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(instrumentService.findByName).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      jest.spyOn(userService, 'findOne');

      expect(await userService.delete(student.id)).toBe(student);
      expect(userService.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
