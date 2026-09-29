import type { BaseUserSession, UserSession } from '@thallesp/nestjs-better-auth';
import type { auth } from '../../../auth';

export const UserRole = {
    USER: 'USER',
    ADMIN: 'ADMIN',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];


export type AuthenticatedUser = Omit<BaseUserSession['user'], 'role'> & {
    role: UserRole;
};

export type AppUserSession = Omit<UserSession<typeof auth>, 'user'> & {
    user: AuthenticatedUser;
};