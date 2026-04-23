import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateScoringConfigDto } from './dto/create-scoring-config.dto';
import { UpdateScoringConfigDto } from './dto/update-scoring-config.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('scoring')
  listScoringConfig() {
    return this.settingsService.listScoringConfig();
  }

  @Post('scoring')
  createScoringConfig(
    @Body() dto: CreateScoringConfigDto,
    @Req() request: { user: { sub: string } },
  ) {
    return this.settingsService.createScoringConfig(dto, request.user.sub);
  }

  @Patch('scoring/:id')
  updateScoringConfig(
    @Param('id') id: string,
    @Body() dto: UpdateScoringConfigDto,
    @Req() request: { user: { sub: string } },
  ) {
    return this.settingsService.updateScoringConfig(id, dto, request.user.sub);
  }

  @Delete('scoring/:id')
  deleteScoringConfig(@Param('id') id: string) {
    return this.settingsService.deleteScoringConfig(id);
  }
}
