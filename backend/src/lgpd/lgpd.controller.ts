import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLgpdDeletionRequestDto } from './dto/create-lgpd-deletion-request.dto';
import { UpdateLgpdDeletionRequestDto } from './dto/update-lgpd-deletion-request.dto';
import { LgpdService } from './lgpd.service';

@Controller('lgpd')
export class LgpdController {
  constructor(private readonly lgpdService: LgpdService) {}

  @Post('deletion-requests')
  createDeletionRequest(@Body() dto: CreateLgpdDeletionRequestDto) {
    return this.lgpdService.createDeletionRequest(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('deletion-requests')
  listDeletionRequests(@Query('status') status?: string) {
    return this.lgpdService.listDeletionRequests(status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('deletion-requests/:id')
  updateDeletionRequest(
    @Param('id') id: string,
    @Body() dto: UpdateLgpdDeletionRequestDto,
    @Req() request: { user: { sub: string } },
  ) {
    return this.lgpdService.updateDeletionRequest(id, dto, request.user.sub);
  }
}
