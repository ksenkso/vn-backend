import { SetMetadata } from '@nestjs/common';

export const OnlyOwner = (...roles: any[]) => SetMetadata('OnlyOwner', roles);
