import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersGuard } from '../guard/user.guard';
import { Roles } from '../guard/role.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @Roles(['admin'])
  // @UseGuards(UsersGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(UsersGuard)
  @Roles(['admin'])
  findAll(@Query() query: { limit?: number; page?: number; skip?: number }) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

@Controller('user/me')
export class UserMeController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(['user'])
  @UseGuards(UsersGuard)
  async getMe(payload) {
    return this.userService.getMe(payload); // Replace 1 with the actual user ID
  }
}
