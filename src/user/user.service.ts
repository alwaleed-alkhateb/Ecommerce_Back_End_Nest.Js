import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    return this.user.create(createUserDto);
  }

  findAll() {
    return this.user.find();
  }

  findOne(id: number) {
    return this.user.findById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.user.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  remove(id: number) {
    return this.user.findByIdAndDelete(id);
  }
}
