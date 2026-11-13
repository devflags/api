import { DatabaseService } from "../database/database.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateFlagDto } from "./dtos/create-flag.dto";
import { FeatureFlagType } from "../database/generated/prisma/browser";
import { Prisma } from "../database/generated/prisma/client";

@Injectable()
export class FlagService {
    constructor(private readonly database: DatabaseService) { }

    getAll(projectId: string) {
        return this.database.featureFlag.findMany({
            where: {
                projectId,
            },
            select: {
                id: true,
                key: true,
                name: true,
                type: true,
                description: true,
                environments: {
                    select: {
                        environment: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                        enabled: true,
                        defaultValue: true,
                    },
                },
            },
        });
    }

    async create(
        projectId: string,
        dto: CreateFlagDto,
    ) {

        return this.database.featureFlag.create({
            data: {
                key: dto.key,
                name: dto.name,
                type: dto.type as FeatureFlagType,
                description: dto.description,
                projectId,
            },
        });
    }
}