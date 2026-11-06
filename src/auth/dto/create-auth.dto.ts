import { IsEmail, IsString, Length } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class ResetDto {
  @IsEmail()
  email: string;
}

export class ChangePasswordDto {
  @IsEmail()
  email: string;
  @IsString()
  @Length(6, 20)
  password: string;
}
