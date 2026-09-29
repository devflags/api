import type { UserSession } from "@thallesp/nestjs-better-auth";

export type AuthUser = Pick<
    UserSession["user"],
    "id" | "email" | "name"
>;

export type AuthSession = Pick<
    UserSession["session"],
    "id" | "userId" | "expiresAt" | "activeOrganizationId"
>;