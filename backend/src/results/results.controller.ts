import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBulkResultsDto } from './dto/create-bulk-results.dto';
import { CreateResultDto } from './dto/create-result.dto';
import { ResultsService } from './results.service';
import { UpdateResultDto } from './dto/update-result.dto';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  listResults() {
    return this.resultsService.listResults();
  }

  @Get('aldebarun')
  listAldebarunResults() {
    return this.resultsService.listAldebarunResults();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  listAdminResults(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('teamId') teamId?: string,
    @Query('sportId') sportId?: string,
  ) {
    return this.resultsService.listAdminResults({
      page,
      pageSize,
      teamId,
      sportId,
    });
  }

  @Get('ranking')
  getRanking() {
    return this.resultsService.getRanking();
  }

  @Get('audit')
  @UseGuards(JwtAuthGuard)
  listAuditLogs() {
    return this.resultsService.listAuditLogs();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createResult(@Body() dto: CreateResultDto, @Req() request: { user: { sub: string } }) {
    return this.resultsService.createResult(dto, request.user.sub);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  createBulkResults(
    @Body() dto: CreateBulkResultsDto,
    @Req() request: { user: { sub: string } },
  ) {
    return this.resultsService.createBulkResults(dto.items, request.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateResult(
    @Param('id') id: string,
    @Body() dto: UpdateResultDto,
    @Req() request: { user: { sub: string } },
  ) {
    return this.resultsService.updateResult(id, dto, request.user.sub);
  }
}
