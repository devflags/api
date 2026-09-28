
import { DatabaseModule } from '@devflags/database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from "../auth"; // Your Better Auth instance



@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, AuthModule.forRoot({ auth }),
  ],
})
export class AppModule { }
