import { Body, Controller, Get, Param, Post, Session } from "@nestjs/common";
import { OrgRoles, UserSession } from "@thallesp/nestjs-better-auth";
import { ActiveOrganizationId } from "src/common/decorators/current-active-org.decorator";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { CreateFlagDto } from "./dtos/create-flag.dto";
import { FlagService } from "./flag.service";

@Controller("projects/:projectId/flags")
export class FlagController {
    constructor(private readonly flagsService: FlagService) { }
    // Add your flag-related endpoints here

    @Get()
    @OrgRoles(["owner", "admin", "member"])
    getFlags(
        @Param("projectId") projectId: string,
    ) {
        return this.flagsService.getAll(projectId);
    }

    @Post()
    @OrgRoles(["owner", "admin"])
    createFlag(
        @Param("projectId") projectId: string,
        @CurrentUser() user: UserSession["user"],
        @ActiveOrganizationId() organizationId: string,
        @Body() dto: CreateFlagDto,
    ) {
        return this.flagsService.create(
            projectId,
            organizationId,
            dto,
        );
    }
}