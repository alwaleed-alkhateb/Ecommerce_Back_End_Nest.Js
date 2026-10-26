import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.URI!),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

// jCBGDjitAemW18JO

// mongodb+srv://alwaledcs_db_user:<db_password>@cluster1.divlvf4.mongodb.net/
// mongodb+srv://alwaledcs_db_user:<db_password>@cluster1.divlvf4.mongodb.net/
