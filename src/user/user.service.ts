import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const isEmailExist = await this.user.findOne({
      email: createUserDto.email,
    });
    if (isEmailExist) {
      throw new HttpException('Email already exists', 400);
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.user.create({ ...createUserDto, password: hashPassword });

    return user;
  }

  findAll(query) {
    const { limit, skip, sort } = query;
    return this.user.find().skip(skip).limit(limit).sort(sort);
  }

  findOne(id: number) {
    return this.user.findById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const isEmailExist = await this.user.findOne({
      email: updateUserDto.email,
    });
    if (!isEmailExist) {
      throw new HttpException('Email not exists', 400);
    }
    const hashPassword = await bcrypt.hash(updateUserDto.password!, 10);

    const updatedUser = { ...updateUserDto, password: hashPassword };

    return this.user.findByIdAndUpdate(id, updatedUser, { new: true });
  }

  remove(id: number) {
    return this.user.findByIdAndDelete(id);
  }

  async getMe(payload) {
    const user = await this.user.findById(payload.id).select('-password'); // Exclude the password field from the result
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }
}
