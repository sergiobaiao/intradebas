import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateResultDto } from './dto/create-result.dto';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  listResults() {
    return this.resultsService.listResults();
  }

  @Get('ranking')
  getRanking() {
    return this.resultsService.getRanking();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createResult(@Body() dto: CreateResultDto, @Req() request: { user: { sub: string } }) {
    return this.resultsService.createResult(dto, request.user.sub);
  }
}

