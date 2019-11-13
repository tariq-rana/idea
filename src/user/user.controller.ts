import { Controller, Get, Post, Body, UsePipes, Param } from '@nestjs/common';
import { ValidationPipe } from '../shared/validation.pipe';

import { UserService } from './user.service';
import { UserDTO } from './user.dto';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Get()
    findAllUser(){
        return this.userService.findAllUser();
    }

    @Get(':id')
    findOneUser(@Param('id') id:string){
        return this.userService.findOneUser(id);
    }


    @Post()
    @UsePipes(new ValidationPipe())
    insertUser(@Body() userDTO: UserDTO){
        return this.userService.insertUser(userDTO);
    }


    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() userDTO: UserDTO){
            return this.userService.login(userDTO);
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() userDTO: UserDTO){
        return this.userService.register(userDTO);
    }

}
