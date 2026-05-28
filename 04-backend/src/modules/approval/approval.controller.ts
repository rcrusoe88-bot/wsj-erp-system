import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { ApproveDto } from './dto/approve.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('approval')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Post('stock-in/:id')
  @Roles('admin', 'reviewer')
  approveStockIn(
    @Param('id') id: string,
    @Body() dto: ApproveDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.approvalService.approveStockIn(id, dto, user.id);
  }

  @Post('stock-out/:id')
  @Roles('admin', 'reviewer')
  approveStockOut(
    @Param('id') id: string,
    @Body() dto: ApproveDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.approvalService.approveStockOut(id, dto, user.id);
  }

  @Get('history/:businessType/:businessId')
  getHistory(
    @Param('businessType') businessType: string,
    @Param('businessId') businessId: string,
  ) {
    return this.approvalService.getApprovalHistory(businessType, businessId);
  }
}
