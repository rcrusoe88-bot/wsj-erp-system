import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApprovalDecision } from '@prisma/client';

export class ApproveDto {
  @IsEnum(ApprovalDecision)
  decision!: ApprovalDecision;

  @IsOptional()
  @IsString()
  decisionReason?: string;
}
