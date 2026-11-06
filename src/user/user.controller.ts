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
  Req,
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

@Controller('v1/userMe')
export class UserMeController {
  constructor(private readonly userService: UserService) {}

  // For User
  //  @docs   Any User can get data on your account
  //  @Route  GET /api/v1/user/me
  //  @access Private [user, admin]
  @Get()
  @Roles(['user', 'admin'])
  @UseGuards(UsersGuard)
  getMe(@Req() req, @I18n() i18n: I18nContext) {
    return this.userService.getMe(req.user, i18n);
  }
  //  @docs   Any User can update data on your account
  //  @Route  PATCH /api/v1/user/me
  //  @access Private [user, admin]
  @Patch()
  @Roles(['user', 'admin'])
  @UseGuards(UsersGuard)
  updateMe(
    @Req() req,
    @Body()
    updateUserDto: UpdateUserDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userService.updateMe(req.user, updateUserDto, i18n);
  }
  //  @docs   Any User can unActive your account
  //  @Route  DELETE /api/v1/user/me
  //  @access Private [user]
  @Delete()
  @Roles(['user'])
  @UseGuards(UsersGuard)
  deleteMe(@Req() req, @I18n() i18n: I18nContext) {
    return this.userService.deleteMe(req.user, i18n);
  }
}
