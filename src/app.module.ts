import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdeaModule } from './idea/idea.module';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptors } from './shared/logging.interceptors';
import { ValidationPipe } from './shared/validation.pipe';


@Module({
  imports: [
    TypeOrmModule.forRoot(),
    IdeaModule,
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
