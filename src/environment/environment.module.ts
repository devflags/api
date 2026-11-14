import { Module } from '@nestjs/common';
import { EnvironmentService } from './environment.service';
import { EnvironmentController } from './environment.controller';
import { DatabaseModule } from 'src/database/database.module';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  imports: [DatabaseModule, OrganizationModule],
  controllers: [EnvironmentController],
  providers: [EnvironmentService],
})
export class EnvironmentModule {}
