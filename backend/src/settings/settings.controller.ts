import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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

  @Patch('scoring/:id')
  updateScoringConfig(
    @Param('id') id: string,
    @Body() dto: UpdateScoringConfigDto,
    @Req() request: { user: { sub: string } },
  ) {
    return this.settingsService.updateScoringConfig(id, dto, request.user.sub);
  }
}
