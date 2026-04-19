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

  @Get('sponsors')
  @UseGuards(JwtAuthGuard)
  listSponsors() {
    return this.sponsorshipService.listSponsors();
  }

  @Get('backdrop')
  listBackdropSponsors() {
    return this.sponsorshipService.listBackdropSponsors();
  }

  @Get('coupons')
  @UseGuards(JwtAuthGuard)
  listCoupons() {
    return this.sponsorshipService.listCoupons();
  }

  @Get('sponsors/:id/coupons')
  @UseGuards(JwtAuthGuard)
  listSponsorCoupons(@Param('id') id: string) {
    return this.sponsorshipService.listSponsorCoupons(id);
  }

  @Patch('sponsors/:id/activate')
  @UseGuards(JwtAuthGuard)
  activateSponsor(@Param('id') id: string) {
    return this.sponsorshipService.activateSponsor(id);
  }
}
