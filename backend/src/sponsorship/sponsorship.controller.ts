import { Body, Controller, Get, Post } from '@nestjs/common';
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
}

