import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { SponsorshipController } from './sponsorship.controller';
import { SponsorshipService } from './sponsorship.service';

@Module({
  imports: [AuthModule, MailModule],
  controllers: [SponsorshipController],
  providers: [SponsorshipService],
  exports: [SponsorshipService],
})
export class SponsorshipModule {}
