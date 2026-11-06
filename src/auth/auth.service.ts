import {
  Body,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateAuthDto,
  ResetDto,
} from './dto/create-auth.dto';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn-dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private user: Model<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signUp(createAuthDto: CreateAuthDto) {
    const isEmailExist = await this.user.findOne({
      email: createAuthDto.email,
    });
    if (isEmailExist) {
      throw new Error('Email already exists');
    }

    const hashPassword = await bcrypt.hash(createAuthDto.password, 10);

    const user = await this.user.create({
      ...createAuthDto,
      password: hashPassword,
    });
    const payload = { id: user._id, email: user.email, role: user.Role };
    const token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET!,
    });

    return {
      message: 'User created successfully',
      data: user,
      token,
    };
  }

  async signIn(@Body() signInDto: SignInDto) {
    const user = await this.user.findOne({ email: signInDto.email });
    if (!user) {
      throw new NotFoundException();
    }
    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("password doesn't match");
    }

    const payload = { id: user._id, email: user.email, role: user.Role };
    const token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET!,
    });

    return {
      message: 'user sign in',
      access_token: token,
    };
  }

  async resetPassword(resetDto: ResetDto) {
    const user = await this.user.findOne({ email: resetDto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.mailerService.sendMail({
      from: process.env.EMAIL,
      to: resetDto.email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${code}`,
    });
    await this.user.updateOne(
      { email: resetDto.email },
      { verificationCode: code },
    );
    return code;
  }

  async verifyCode({ email, code }: { email: string; code: string }) {
    const user = await this.user.findOne({ email });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.verificationCode !== code) {
      throw new UnauthorizedException('Invalid verificationCode ');
    }
    await this.user.findOneAndUpdate({ email }, { verificationCode: null });

    return {
      status: 200,
      message: 'Code verified successfully',
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.user.findOne({ email: changePasswordDto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashPassword = await bcrypt.hash(changePasswordDto.password, 10);
    await this.user.findOneAndUpdate(
      { email: changePasswordDto.email },
      { password: hashPassword },
    );

    return {
      status: 200,
      message: 'Password changed successfully',
    };
  }
}
