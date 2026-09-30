import { Body, Controller, Param, Post, Session } from "@nestjs/common";
import { OrgRoles, UserSession } from "@thallesp/nestjs-better-auth";
import { ActiveOrganizationId } from "src/common/decorators/current-active-org.decorator";
import { CurrentUser } from "src/common/decorators/current-user.decorator";

@Controller("projects/:projectId")
export class FlagController {
    // Add your flag-related endpoints here

    @Post("flags/:flagId")
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