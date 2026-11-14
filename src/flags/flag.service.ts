import { DatabaseService } from '../database/database.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlagDto, UpdateFlagDto } from './dtos/create-flag.dto';
import { FeatureFlagType } from '../database/generated/prisma/browser';
import { Prisma } from '../database/generated/prisma/client';
import {
  UpdateFlagEnvironmentDto,
  CreateTargetingRuleDto,
  UpdateTargetingRuleDto,
} from './dtos/targeting-rule.dto';

@Injectable()
export class FlagService {
  constructor(private readonly database: DatabaseService) {}

  async findFlag(organizationId: string, projectId: string, flagId: string) {
    const flag = await this.database.featureFlag.findFirst({
      where: { id: flagId, projectId, project: { organizationId } },
      select: {
        id: true,
        projectId: true,
        key: true,
        name: true,
        type: true,
        description: true,
      },
    });
    if (!flag) throw new NotFoundException('Feature flag not found.');
    return flag;
  }

  private async getScopedEnvironment(
    organizationId: string,
    projectId: string,
    flagId: string,
    environmentId: string,
  ) {
    const configuration = await this.database.flagEnvironment.findFirst({
      where: {
        flagId,
        environmentId,
        flag: {
          projectId,
          project: { organizationId },
        },
        environment: { projectId },
      },
      include: { flag: { select: { type: true } } },
    });

    if (!configuration)
      throw new NotFoundException('Flag environment configuration not found.');
    return configuration;
  }

  private toJson(
    value: unknown,
  ): Prisma.InputJsonValue | typeof Prisma.JsonNull {
    return value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
  }

  private assertFlagValue(type: FeatureFlagType, value: unknown) {
    const valid =
      type === FeatureFlagType.BOOLEAN
        ? typeof value === 'boolean'
        : type === FeatureFlagType.STRING
          ? typeof value === 'string'
          : type === FeatureFlagType.NUMBER
            ? typeof value === 'number' && Number.isFinite(value)
            : true;

    if (!valid)
      throw new BadRequestException(`Value must match the ${type} flag type.`);
  }

  async getEnvironmentConfiguration(
    organizationId: string,
    projectId: string,
    flagId: string,
    environmentId: string,
  ) {
    const configuration = await this.getScopedEnvironment(
      organizationId,
      projectId,
      flagId,
      environmentId,
    );
    const rules = await this.database.targetingRule.findMany({
      where: { flagEnvironmentId: configuration.id },
      include: { conditions: true },
      orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
    });
    return {
      id: configuration.id,
      flagId: configuration.flagId,
      environmentId: configuration.environmentId,
      enabled: configuration.enabled,
      defaultValue: configuration.defaultValue,
      rules,
    };
  }

  async updateEnvironmentConfiguration(
    organizationId: string,
    projectId: string,
    flagId: string,
    environmentId: string,
    dto: UpdateFlagEnvironmentDto,
  ) {
    const configuration = await this.getScopedEnvironment(
      organizationId,
      projectId,
      flagId,
      environmentId,
    );
    if (dto.defaultValue === undefined)
      throw new BadRequestException('A default value is required.');
    this.assertFlagValue(configuration.flag.type, dto.defaultValue);

    return this.database.flagEnvironment.update({
      where: { id: configuration.id },
      data: {
        enabled: dto.enabled,
        defaultValue: this.toJson(dto.defaultValue),
      },
    });
  }

  async createTargetingRule(
    organizationId: string,
    projectId: string,
    flagId: string,
    environmentId: string,
    dto: CreateTargetingRuleDto,
  ) {
    const configuration = await this.getScopedEnvironment(
      organizationId,
      projectId,
      flagId,
      environmentId,
    );
    if (dto.value === undefined)
      throw new BadRequestException('A rule value is required.');
    if (dto.conditions.some((condition) => condition.value === undefined)) {
      throw new BadRequestException('Every condition must have a value.');
    }
    this.assertFlagValue(configuration.flag.type, dto.value);

    return this.database.targetingRule.create({
      data: {
        flagEnvironmentId: configuration.id,
        priority: dto.priority ?? 0,
        percentage: dto.percentage ?? null,
        value: this.toJson(dto.value),
        conditions: {
          create: dto.conditions.map((condition) => ({
            ...condition,
            value: this.toJson(condition.value),
          })),
        },
      },
      include: { conditions: true },
    });
  }

  async updateTargetingRule(
    organizationId: string,
    projectId: string,
    flagId: string,
    environmentId: string,
    ruleId: string,
    dto: UpdateTargetingRuleDto,
  ) {
    const configuration = await this.getScopedEnvironment(
      organizationId,
      projectId,
      flagId,
      environmentId,
    );
    const rule = await this.database.targetingRule.findFirst({
      where: { id: ruleId, flagEnvironmentId: configuration.id },
    });
    if (!rule) throw new NotFoundException('Targeting rule not found.');

    if (dto.value !== undefined)
      this.assertFlagValue(configuration.flag.type, dto.value);
    if (dto.conditions?.some((condition) => condition.value === undefined)) {
      throw new BadRequestException('Every condition must have a value.');
    }

    return this.database.targetingRule.update({
      where: { id: rule.id },
      data: {
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.percentage !== undefined && { percentage: dto.percentage }),
        ...(dto.value !== undefined && { value: this.toJson(dto.value) }),
        ...(dto.conditions !== undefined && {
          conditions: {
            deleteMany: {},
            create: dto.conditions.map((condition) => ({
              ...condition,
              value: this.toJson(condition.value),
            })),
          },
        }),
      },
      include: { conditions: true },
    });
  }

  async deleteTargetingRule(
    organizationId: string,
    projectId: string,
    flagId: string,
    environmentId: string,
    ruleId: string,
  ) {
    const configuration = await this.getScopedEnvironment(
      organizationId,
      projectId,
      flagId,
      environmentId,
    );
    const rule = await this.database.targetingRule.findFirst({
      where: { id: ruleId, flagEnvironmentId: configuration.id },
      select: { id: true },
    });
    if (!rule) throw new NotFoundException('Targeting rule not found.');

    await this.database.targetingRule.delete({ where: { id: rule.id } });
    return { success: true };
  }

  async findFlags(
    organizationId: string,
    projectId: string,
    environmentId: string | undefined,
    limit = 20,
    cursor?: string,
  ) {
    if (environmentId) {
      const environment = await this.database.environment.findFirst({
        where: {
          id: environmentId,
          projectId,
          project: { organizationId },
        },
        select: { id: true },
      });
      if (!environment) throw new NotFoundException('Environment not found.');
    }

    const flags = await this.database.featureFlag.findMany({
      where: {
        projectId,
        project: { organizationId },
      },
      select: {
        id: true,
        key: true,
        name: true,
        type: true,
        description: true,
        environments: {
          where: environmentId ? { environmentId } : undefined,
          select: {
            enabled: true,
            defaultValue: true,
            environment: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });

    const hasMore = flags.length > limit;
    const data = (hasMore ? flags.slice(0, limit) : flags).map((flag) => ({
      ...flag,
      environments: flag.environments.map(({ environment, ...env }) => ({
        ...environment,
        ...env,
      })),
    }));

    return {
      data,
      pagination: {
        nextCursor: hasMore ? data[data.length - 1].id : null,
        hasMore,
      },
    };
  }

  async create(projectId: string, dto: CreateFlagDto) {
    const envs = await this.database.environment.findMany({
      where: {
        projectId,
      },
    });

    return this.database.featureFlag.create({
      data: {
        key: dto.key,
        name: dto.name,
        type: dto.type,
        description: dto.description,
        projectId,
        environments: {
          create: envs.map((env) => ({
            environment: {
              connect: {
                id: env.id,
              },
            },
            enabled: false,
            defaultValue: Prisma.JsonNull,
          })),
        },
      },
    });
  }

  async update(projectId: string, flagId: string, dto: UpdateFlagDto) {
    const flag = await this.database.featureFlag.findFirst({
      where: { id: flagId, projectId },
      select: { id: true },
    });

    if (!flag) {
      throw new BadRequestException('Feature flag not found.');
    }

    return this.database.featureFlag.update({
      where: { id: flagId },
      data: {
        ...(dto.key !== undefined && { key: dto.key }),
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.type !== undefined && { type: dto.type }),
      },
    });
  }
}
