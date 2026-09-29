import { Controller, Get } from "@nestjs/common";
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';



@Controller("projects")
export class ProjectController {
    constructor() {

    }

    @Get()
    async getProjects(@Session() session: UserSession) {
        return { user: session.user };
    }
}