import { Body, Controller, Get, Post } from "@nestjs/common";
import { OrgRoles, Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { CreateProjectDto } from "./dtos/create-project.dto";
import { ActiveOrganizationId } from "src/common/decorators/current-active-org.decorator";
import { CurrentUser } from "src/common/decorators/current-user.decorator";



@Controller("projects")
export class ProjectController {
    constructor() {

    }

    @Get()
    async getProjects(@Session() session: UserSession) {
        return { user: session.user };
    }

    /*     @Post()
        @OrgRoles(["owner", "admin"])
        create(
            @Session() session: UserSession,
            @Body() dto: CreateProjectDto,
        ) {
            return this.projectsService.create(
                session.user.id,
                session.session.activeOrganizationId!,
                dto,
            );
        } */

    @Post()
    @OrgRoles(["owner", "admin"])
    create(
        @CurrentUser() user: UserSession["user"],
        @ActiveOrganizationId() organizationId: string,
        @Body() dto: CreateProjectDto,
    ) {
        return this.projectsService.create(
            user.id,
            organizationId,
            dto,
        );
    }
}