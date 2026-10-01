import { Module } from "@nestjs/common";
import { OrganizationService } from "./organization.service";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [DatabaseModule],
    providers: [OrganizationService],
    exports: [OrganizationService],
})

export class OrganizationModule { }