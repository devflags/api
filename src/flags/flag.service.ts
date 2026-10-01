import { DatabaseService } from "../database/database.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateFlagDto } from "./dtos/create-flag.dto";
import { FeatureFlagType } from "../database/generated/prisma/browser";
import { Prisma } from "../database/generated/prisma/client";

@Injectable()
export class FlagService {
    constructor(private readonly database: DatabaseService) { }

    async create(
        projectId: string,
        organizationId: string,
        dto: CreateFlagDto,
    ) {

        for (const env of dto.environments || []) {
            switch (dto.type) {
                case FeatureFlagType.BOOLEAN:
                    if (typeof env.defaultValue !== "boolean") {
                        throw new BadRequestException(
                            "defaultValue must be a boolean",
                        );
                    }
                    break;

                case FeatureFlagType.STRING:
                    if (typeof env.defaultValue !== "string") {
                        throw new BadRequestException(
                            "defaultValue must be a string",
                        );
                    }
                    break;

                case FeatureFlagType.NUMBER:
                    if (typeof env.defaultValue !== "number") {
                        throw new BadRequestException(
                            "defaultValue must be a number",
                        );
                    }
                    break;
            }
        }


        const environmentsData = (dto.environments || []).map((env) => ({
            environment: {
                connect: {
                    id: env.environmentId,
                },
            },
            enabled: env.enabled,
            defaultValue: env.defaultValue as Prisma.InputJsonValue,
        }));

        return this.database.featureFlag.create({
            data: {
                key: dto.key,
                name: dto.name,
                projectId,
                environments: {
                    create: environmentsData,
                },
            },
        });
    }
}