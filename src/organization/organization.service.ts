import { DatabaseService } from "@devflags/database";
import { ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class OrganizationService {

    constructor(private readonly database: DatabaseService) { }

    async getMember(userId: string, organizationId: string) {
        return this.database.member.findFirst({
            where: {
                userId,
                organizationId,
            },
        });
    }

    async requireAdmin(userId: string, organizationId: string) {
        const member = await this.getMember(userId, organizationId);

        if (!member) {
            throw new ForbiddenException();
        }

        if (!["owner", "admin"].includes(member.role)) {
            throw new ForbiddenException();
        }

        return member;
    }
}