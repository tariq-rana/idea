import { Controller, Get, Post, Body, UsePipes, Param, Query,UseGuards } from '@nestjs/common';
import { ValidationPipe } from '../shared/validation.pipe';

import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { User } from './user.decorator';
import { AuthGuard } from '../shared/auth.guard';

@Controller()
export class UserController {
    constructor(private readonly userService:UserService){}


    @Get('/api/user')
    findAllUser(@Query('page') page:number){
        return this.userService.findAllUser(page);
    }
    @Get('/api/user/:username')
    findAfindOneUserByNamellUser(@Param('username') username:string){
        return this.userService.findOneUserByName(username);
    }

    
    // @UseGuards(new AuthGuard())
    // @Get('/api/user')
    // findAllUser(@User() user){
    //     console.log(user);

    //     return this.userService.findAllUser();
    // }

    @Get('/api/user/:id')
    findOneUser(@Param('id') id:string){
        return this.userService.findOneUser(id);
    }


    // @Post()
    // @UsePipes(new ValidationPipe())
    // insertUser(@Body() userDTO: UserDTO){
    //     return this.userService.insertUser(userDTO);
    // }


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
