import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  CreateAuthDto,
  ResetDto,
} from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class SignupController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() createAuthDto: CreateAuthDto) {
    return await this.authService.signUp(createAuthDto);
  }

  @Post('signIn')
  async signIn(@Body() createAuthDto: CreateAuthDto) {
    return await this.authService.signIn(createAuthDto);
  }

  @Post('resetPassword')
  async resetPassword(@Body() resetDto: ResetDto) {
    return await this.authService.resetPassword(resetDto);
  }

  @Post('verifyCode')
  async verifyCode(@Body() verifyDto: { email: string; code: string }) {
    return await this.authService.verifyCode(verifyDto);
  }

  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.authService.changePassword(changePasswordDto);
  }
}
