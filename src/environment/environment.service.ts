import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateEnvironmentDto } from "./dtos/create-environment.dto";
import slugify from "slugify";

@Injectable()
export class EnvironmentService {
    constructor(private readonly database: DatabaseService) { }

    getEnvironments(projectId: string) {
        return this.database.environment.findMany({
            where: {
                projectId,
            },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });
    }

    create(projectId: string, dto: CreateEnvironmentDto) {
        return this.database.environment.create({
            data: {
                name: dto.name,
                slug: slugify(dto.name),
                project: {
                    connect: {
                        id: projectId,
                    },
                },
            },
        });
    }
}