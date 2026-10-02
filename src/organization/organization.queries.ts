import type { DatabaseService } from "../database/database.service";

type OrganizationDatabase = Pick<DatabaseService, "member">;

export async function getFirstOrganizationForUser(
    database: OrganizationDatabase,
    userId: string,
) {
    const membership = await database.member.findFirst({
        where: { userId },
        orderBy: { createdAt: "asc" },
        select: { organizationId: true },
    });

    return membership ? { id: membership.organizationId } : null;
}
