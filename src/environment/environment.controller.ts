import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrgRoles, UserSession } from '@thallesp/nestjs-better-auth';
import { ActiveOrganizationId } from 'src/common/decorators/current-active-org.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateEnvironmentDto } from './dtos/create-environment.dto';
import { EnvironmentService } from './environment.service';

@Controller('projects/:projectId/environments')
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @Get()
  @OrgRoles(['owner', 'admin', 'member'])
  getEnvironments(
    @ActiveOrganizationId() organizationId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.environmentService.getEnvironments(organizationId, projectId);
  }

  @Post()
  @OrgRoles(['owner', 'admin'])
  createEnvironment(
    @Param('projectId') projectId: string,
    @CurrentUser() user: UserSession['user'],
    @ActiveOrganizationId() organizationId: string,
    @Body() dto: CreateEnvironmentDto,
  ) {
    return this.environmentService.create(
      user.id,
      organizationId,
      projectId,
      dto,
    );
  }
}
