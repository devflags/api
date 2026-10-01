import { Module } from "@nestjs/common";
import { FlagService } from "./flag.service";
import { FlagController } from "./flag.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [FlagController],
    providers: [FlagService],
    exports: [FlagService],
})
export class FlagModule { }