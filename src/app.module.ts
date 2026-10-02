
import { DatabaseModule } from './database/database.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from "./auth"; // Your Better Auth instance
import { ProjectModule } from './projects/project.module';
import { FlagModule } from './flags/flag.module';
import { EnvironmentModule } from './environment/environment.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';



@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
  AuthModule.forRoot({ auth }),
    ProjectModule,
    FlagModule,
    EnvironmentModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware)
      .forRoutes('*');
  }
}
