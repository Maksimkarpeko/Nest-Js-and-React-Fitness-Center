import { UserRole } from 'src/generated/prisma/index.js';

export interface Authenticated {
  userId: string;
  login: string;
  role: UserRole;
}
export interface AuthPayload {
  sub: number;
  login: string;
  role: UserRole;
}

export interface RequestWithUser extends Request {
  user: Authenticated;
}

export interface RefreshRequest extends Request {
  cookies: {
    refresh_token?: string;
  };
}
