import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AthletesService } from './athletes.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { UpdateAthleteStatusDto } from './dto/update-athlete-status.dto';

@Controller('athletes')
export class AthletesController {
  constructor(private readonly athletesService: AthletesService) {}

  @Get('admin/review')
  @UseGuards(JwtAuthGuard)
  findReviewList(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
    @Query('teamId') teamId?: string,
    @Query('search') search?: string,
  ) {
    return this.athletesService.findReviewPage({
      page,
      pageSize,
      status,
      teamId,
      search,
    });
  }

  @Get()
  findAll() {
    return this.athletesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.athletesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAthleteDto) {
    return this.athletesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAthleteDto,
    @Req() request: { user: { sub: string } },
  ) {
    return this.athletesService.update(id, dto, request.user.sub);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAthleteStatusDto,
    @Req() request: { user: { sub: string } },
  ) {
    return this.athletesService.updateStatus(id, dto, request.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() request: { user: { sub: string } }) {
    return this.athletesService.remove(id, request.user.sub);
  }
}
