import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSponsorInterestDto } from './dto/create-sponsor-interest.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
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
  listSponsors(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
  ) {
    if (page || pageSize || status) {
      return this.sponsorshipService.listSponsorsPage({
        page,
        pageSize,
        status,
      });
    }

    return this.sponsorshipService.listSponsors();
  }

  @Get('backdrop')
  listBackdropSponsors() {
    return this.sponsorshipService.listBackdropSponsors();
  }

  @Get('coupons')
  @UseGuards(JwtAuthGuard)
  listCoupons(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
    @Query('sponsorId') sponsorId?: string,
  ) {
    if (page || pageSize || status || sponsorId) {
      return this.sponsorshipService.listCouponsPage({
        page,
        pageSize,
        status,
        sponsorId,
      });
    }

    return this.sponsorshipService.listCoupons();
  }

  @Get('sponsors/:id/coupons')
  @UseGuards(JwtAuthGuard)
  listSponsorCoupons(@Param('id') id: string) {
    return this.sponsorshipService.listSponsorCoupons(id);
  }

  @Patch('sponsors/:id/activate')
  @UseGuards(JwtAuthGuard)
  activateSponsor(
    @Param('id') id: string,
    @Req() request: { user: { sub: string } },
  ) {
    return this.sponsorshipService.activateSponsor(id, request.user.sub);
  }

  @Patch('sponsors/:id')
  @UseGuards(JwtAuthGuard)
  updateSponsor(
    @Param('id') id: string,
    @Body() dto: UpdateSponsorDto,
    @Req() request: { user: { sub: string } },
  ) {
    return this.sponsorshipService.updateSponsor(id, dto, request.user.sub);
  }

  @Post('sponsors/:id/coupons')
  @UseGuards(JwtAuthGuard)
  createCouponForSponsor(@Param('id') id: string) {
    return this.sponsorshipService.createCouponForSponsor(id);
  }

  @Patch('coupons/:id/expire')
  @UseGuards(JwtAuthGuard)
  expireCoupon(@Param('id') id: string) {
    return this.sponsorshipService.expireCoupon(id);
  }
}
