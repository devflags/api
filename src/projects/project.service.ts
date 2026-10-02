import { Injectable } from "@nestjs/common";
import { CreateProjectDto } from "./dtos/create-project.dto";
import { DatabaseService } from "../database/database.service";
import { OrganizationService } from "src/organization/organization.service";
import slugify from "slugify";

@Injectable()
export class ProjectService {
    constructor(private readonly organizationService: OrganizationService,
        private readonly database: DatabaseService) {
    }

    async getProjects(organizationId: string) {
        return this.database.project.findMany({
            where: {
                organizationId,
            },
            select: {
                id: true,
                name: true,
                slug: true,
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
                description: dto.description,
                slug: slug,
                organizationId,
            },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });
    }
}