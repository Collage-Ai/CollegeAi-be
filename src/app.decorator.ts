import { SetMetadata } from '@nestjs/common';

export const IS_PUBLICK_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLICK_KEY, true);
