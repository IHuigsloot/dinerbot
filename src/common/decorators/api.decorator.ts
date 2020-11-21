import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth-guard';

export const Api = (tag: string) => {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiUnauthorizedResponse({
      description: 'Please provide a valid email for the user header',
    }),
    ApiTags(tag || 'Default'),
    ApiHeader({
      name: 'X-USER',
      description: 'email from the user who sends the request',
      required: true,
    }),
  );
};
