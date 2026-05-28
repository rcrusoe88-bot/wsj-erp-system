import { SetMetadata } from '@nestjs/common';

export const PUBLIC_RESPONSE_KEY = 'public_response';
export const PublicResponse = () => SetMetadata(PUBLIC_RESPONSE_KEY, true);
