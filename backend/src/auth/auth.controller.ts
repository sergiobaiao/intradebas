import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() request: { user: { sub: string } }) {
    return this.authService.me(request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin-users')
  listAdminUsers(@Req() request: { user: { role: 'admin' | 'superadmin' } }) {
    return this.authService.listAdminUsers(request.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin-users')
  createAdminUser(
    @Body() dto: CreateAdminUserDto,
    @Req() request: { user: { role: 'admin' | 'superadmin' } },
  ) {
    return this.authService.createAdminUser(dto, request.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin-users/:id')
  updateAdminUser(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserDto,
    @Req() request: { user: { sub: string; role: 'admin' | 'superadmin' } },
  ) {
    return this.authService.updateAdminUser(id, dto, request.user.role, request.user.sub);
  }
}
