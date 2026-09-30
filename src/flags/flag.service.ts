import { DatabaseService } from "@devflags/database";
import { CreateFlagDto } from "./dtos/create-flag.dto";
import { OrganizationService } from "src/organization/organization.service";

export class FlagService {
    constructor(private readonly database: DatabaseService, private readonly organizationService: OrganizationService) { }

    async create(
        projectId: string,
        organizationId: string,
        dto: CreateFlagDto,
    ) {


        return this.database.featureFlag.create({
            data: {
                key
                name: dto.name,
                projectId,
            },
        });
    }
}