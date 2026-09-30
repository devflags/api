import { Injectable } from "@nestjs/common";
import { CreateProjectDto } from "./dtos/create-project.dto";
import { DatabaseService } from "@devflags/database/database.service";
import { OrganizationService } from "src/organization/organization.service";
import slugify from "slugify";

@Injectable()
export class ProjectService {
    constructor(private readonly organizationService: OrganizationService,
        private readonly database: DatabaseService) {
    }

    async getProjects(organizationId: string) {
        await this.database.project.findMany({
            where: {
                organizationId,
            },
        });
    }

    async create(
        userId: string,
        organizationId: string,
        dto: CreateProjectDto,
    ) {
        await this.organizationService.requireAdmin(
            userId,
            organizationId,
        );

        const slug = slugify(dto.name);

        return this.database.project.create({
            data: {
                name: dto.name,
                slug: slug,
                organizationId,
            },
        });
    }
}