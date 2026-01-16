// Nest Js Imports
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas Imports
import { User, UserSchema } from 'src/schemas/users/user.schema';

// Service Imports
import { UserService } from './user.service';

// Controller Imports
import { UsersController } from './users.controller';

// Module Imports
import { OpenaiModule } from '../openai/openai.module';
import { Support, SupportSchema } from 'src/schemas/support/support.schema';

@Module({
  imports: [
    ConfigModule,
    OpenaiModule,
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Support.name, schema: SupportSchema },
      ]
    )
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule { }
