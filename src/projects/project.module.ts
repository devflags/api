import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { OrganizationModule } from "src/organization/organization.module";
import { DatabaseModule } from "@devflags/database";

@Module({
    imports: [DatabaseModule, OrganizationModule],
    controllers: [ProjectController],
    providers: [ProjectService],
})

export class ProjectModule { }