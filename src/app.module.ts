import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptors } from './shared/logging.interceptors';

import { UserModule } from './user/user.module';
import { IdeaModule } from './idea/idea.module';
import { CommentModule } from './comment/comment.module';



@Module({
  imports: [
    TypeOrmModule.forRoot(),
    IdeaModule,
    UserModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { 
      provide: APP_FILTER, 
      useClass: HttpErrorFilter 
    },
    { 
      provide: APP_INTERCEPTOR, 
      useClass: LoggingInterceptors 
    }  
  ],
  
})
export class AppModule {}
