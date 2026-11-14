import { Type } from 'class-transformer';
import {
  Allow,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { RuleOperator } from '../../database/generated/prisma/enums';

export class RuleConditionDto {
  @IsString()
  attribute!: string;

  @IsEnum(RuleOperator)
  operator!: RuleOperator;

  @Allow()
  value!: unknown;
}

export class CreateTargetingRuleDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  priority?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  percentage?: number | null;

  @Allow()
  value!: unknown;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RuleConditionDto)
  conditions!: RuleConditionDto[];
}

export class UpdateTargetingRuleDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  priority?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  percentage?: number | null;

  @IsOptional()
  @Allow()
  value?: unknown;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RuleConditionDto)
  conditions?: RuleConditionDto[];
}

export class UpdateFlagEnvironmentDto {
  @IsBoolean()
  @IsDefined()
  enabled!: boolean;

  @Allow()
  defaultValue!: unknown;
}
