import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../../role/entities';

export const Roles = (...roles: RoleName[]) => SetMetadata('roles', roles);
