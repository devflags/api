import { Module } from "@nestjs/common";
import { OrganizationService } from "./organization.service";
import { DatabaseService } from "@devflags/database/database.service";

@Module({
    imports: [DatabaseService],
    providers: [OrganizationService],
    exports: [OrganizationService],
})

export class OrganizationModule { }