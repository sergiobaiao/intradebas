import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSponsorInterestDto } from './dto/create-sponsor-interest.dto';
import { SponsorshipService } from './sponsorship.service';

@Controller()
export class SponsorshipController {
  constructor(private readonly sponsorshipService: SponsorshipService) {}

  @Get('sponsorship/quotas')
  listQuotas() {
    return this.sponsorshipService.listQuotas();
  }

  @Post('sponsors')
  createSponsorInterest(@Body() dto: CreateSponsorInterestDto) {
    return this.sponsorshipService.createSponsorInterest(dto);
  }

  @Get('backdrop')
  listBackdropSponsors() {
    return this.sponsorshipService.listBackdropSponsors();
  }

  @Patch('sponsors/:id/activate')
  @UseGuards(JwtAuthGuard)
  activateSponsor(@Param('id') id: string) {
    return this.sponsorshipService.activateSponsor(id);
  }
}
