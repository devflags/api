import { Module } from "@nestjs/common";
import { EnvironmentService } from "./environment.service";
import { EnvironmentController } from "./environment.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [EnvironmentController],
    providers: [EnvironmentService],
})

export class EnvironmentModule { }