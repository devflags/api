import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrgRoles } from '@thallesp/nestjs-better-auth';
import { ActiveOrganizationId } from 'src/common/decorators/current-active-org.decorator';
import { CreateFlagDto, UpdateFlagDto } from './dtos/create-flag.dto';
import {
  CreateTargetingRuleDto,
  UpdateFlagEnvironmentDto,
  UpdateTargetingRuleDto,
} from './dtos/targeting-rule.dto';
import { FlagService } from './flag.service';

@Controller('projects/:projectId/flags')
export class FlagController {
  constructor(private readonly flagsService: FlagService) {}
  // Add your flag-related endpoints here

  @Get()
  @OrgRoles(['owner', 'admin', 'member'])
  getFlags(
    @ActiveOrganizationId() organizationId: string,
    @Param('projectId') projectId: string,
    @Query('environmentId') environmentId: string,
    @Param('limit') limit?: number,
    @Param('cursor') cursor?: string,
  ) {
    return this.flagsService.findFlags(
      organizationId,
      projectId,
      environmentId,
      limit,
      cursor,
    );
  }

  @Post()
  @OrgRoles(['owner', 'admin'])
  createFlag(
    @Param('projectId') projectId: string,
    @Body() dto: CreateFlagDto,
  ) {
    return this.flagsService.create(projectId, dto);
  }

  @Patch(':flagId')
  @OrgRoles(['owner', 'admin'])
  updateFlag(
    @Param('projectId') projectId: string,
    @Param('flagId') flagId: string,
    @Body() dto: UpdateFlagDto,
  ) {
    return this.flagsService.update(projectId, flagId, dto);
  }

  @Get(':flagId')
  @OrgRoles(['owner', 'admin', 'member'])
  getFlag(
    @ActiveOrganizationId() organizationId: string,
    @Param('projectId') projectId: string,
    @Param('flagId') flagId: string,
  ) {
    return this.flagsService.findFlag(organizationId, projectId, flagId);
  }

  @Get(':flagId/environments/:environmentId')
  @OrgRoles(['owner', 'admin', 'member'])
  getEnvironmentConfiguration(
    @ActiveOrganizationId() organizationId: string,
    @Param('projectId') projectId: string,
    @Param('flagId') flagId: string,
    @Param('environmentId') environmentId: string,
  ) {
    return this.flagsService.getEnvironmentConfiguration(
      organizationId,
      projectId,
      flagId,
      environmentId,
    );
  }

  @Patch(':flagId/environments/:environmentId')
  @OrgRoles(['owner', 'admin'])
  updateEnvironmentConfiguration(
    @ActiveOrganizationId() organizationId: string,
    @Param('projectId') projectId: string,
    @Param('flagId') flagId: string,
    @Param('environmentId') environmentId: string,
    @Body() dto: UpdateFlagEnvironmentDto,
  ) {
    return this.flagsService.updateEnvironmentConfiguration(
      organizationId,
      projectId,
      flagId,
      environmentId,
      dto,
    );
  }

  @Post(':flagId/environments/:environmentId/rules')
  @OrgRoles(['owner', 'admin'])
  createTargetingRule(
    @ActiveOrganizationId() organizationId: string,
    @Param('projectId') projectId: string,
    @Param('flagId') flagId: string,
    @Param('environmentId') environmentId: string,
    @Body() dto: CreateTargetingRuleDto,
  ) {
    return this.flagsService.createTargetingRule(
      organizationId,
      projectId,
      flagId,
      environmentId,
      dto,
    );
  }

  @Patch(':flagId/environments/:environmentId/rules/:ruleId')
  @OrgRoles(['owner', 'admin'])
  updateTargetingRule(
    @ActiveOrganizationId() organizationId: string,
    @Param('projectId') projectId: string,
    @Param('flagId') flagId: string,
    @Param('environmentId') environmentId: string,
    @Param('ruleId') ruleId: string,
    @Body() dto: UpdateTargetingRuleDto,
  ) {
    return this.flagsService.updateTargetingRule(
      organizationId,
      projectId,
      flagId,
      environmentId,
      ruleId,
      dto,
    );
  }

  @Delete(':flagId/environments/:environmentId/rules/:ruleId')
  @OrgRoles(['owner', 'admin'])
  deleteTargetingRule(
    @ActiveOrganizationId() organizationId: string,
    @Param('projectId') projectId: string,
    @Param('flagId') flagId: string,
    @Param('environmentId') environmentId: string,
    @Param('ruleId') ruleId: string,
  ) {
    return this.flagsService.deleteTargetingRule(
      organizationId,
      projectId,
      flagId,
      environmentId,
      ruleId,
    );
  }
}
