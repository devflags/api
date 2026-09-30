import { Body, Controller, Get, Post } from "@nestjs/common";
import { OrgRoles, Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { CreateProjectDto } from "./dtos/create-project.dto";
import { ActiveOrganizationId } from "src/common/decorators/current-active-org.decorator";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { ProjectService } from "./project.service";



@Controller("projects")
export class ProjectController {
    constructor(private readonly projectsService: ProjectService) {

    }

    @Get()
    @OrgRoles(["owner", "admin", "member"])
    async getProjects(@ActiveOrganizationId() organizationId: string) {
        return this.projectsService.getProjects(organizationId);
    }

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