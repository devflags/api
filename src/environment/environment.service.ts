import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateEnvironmentDto } from './dtos/create-environment.dto';
import slugify from 'slugify';
import { Prisma } from '../database/generated/prisma/client';
import { OrganizationService } from 'src/organization/organization.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class EnvironmentService {
  constructor(
    private readonly database: DatabaseService,
    private readonly organizationService: OrganizationService,
  ) {}

  getEnvironments(organizationId: string, projectId: string) {
    return this.database.environment.findMany({
      where: {
        projectId,
        project: { organizationId },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }

  async create(
    userId: string,
    organizationId: string,
    projectId: string,
    dto: CreateEnvironmentDto,
  ) {
    await this.organizationService.requireAdmin(userId, organizationId);

    const project = await this.database.project.findFirst({
      where: { id: projectId, organizationId },
      select: { id: true },
    });
    if (!project) throw new NotFoundException('Project not found.');

    return this.database.$transaction(async (transaction) => {
      const environment = await transaction.environment.create({
        data: {
          name: dto.name,
          slug: slugify(dto.name),
          project: {
            connect: {
              id: projectId,
            },
          },
        },
      });

      const flags = await transaction.featureFlag.findMany({
        where: { projectId },
        select: { id: true },
      });

      if (flags.length > 0) {
        await transaction.flagEnvironment.createMany({
          data: flags.map((flag) => ({
            flagId: flag.id,
            environmentId: environment.id,
            enabled: false,
            defaultValue: Prisma.JsonNull,
          })),
        });
      }

      return environment;
    });
  }
}
