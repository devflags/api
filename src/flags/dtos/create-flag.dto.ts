import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    MinLength,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { FeatureFlagType } from "../../database/generated/prisma/browser";


export class CreateFlagDto {
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    key!: string;

    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name!: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @IsEnum(FeatureFlagType)
    type!: FeatureFlagType;
}

export class UpdateFlagDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    key?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @IsOptional()
    @IsEnum(FeatureFlagType)
    type?: FeatureFlagType;
}