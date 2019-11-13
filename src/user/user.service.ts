import { Injectable, HttpException, HttpStatus, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { UserDTO } from './user.dto';

//import  * as bcrypt  from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>){}
    
    
    async findAllUser(): Promise<any>{
        
        const users = await this.userRepository.find();

         return users.map( user => {
            return    user.toResponseObject(true);
         });
       
        

        // return await this.userRepository.find();

        // const users = await this.userRepository.find();
       // return  users.map(user =>  user.toResponseObject());

    //    const users = await this.userRepository.find();
       
    //     return users.map( user => {
    //         return    {...user.toResponseObject(true), "bcrypt": bcrypt.hash(user.password,10)}
    //     });
        
    }

    async findOneUser(id:string){
        const user = await this.userRepository.findOne(id);
        return user.toResponseObject();
    }


    async insertUser(userDTO: UserDTO){
        const newUserDTO:UserDTO = Object.assign(new UserEntity(),userDTO);
        return await this.userRepository.save(newUserDTO);
    }

    async login(userDTO: UserDTO){
        const { username, password } = userDTO;
        const user = await this.userRepository.findOne({where:{username}})
        const isPassword =  await user.comparePassword(password);

        if(! user || isPassword === false){
            throw new HttpException('Invalid Username/Password',HttpStatus.BAD_REQUEST);
        }
        return user.toResponseObject();

    }

    async register(userDTO: UserDTO){
        return await this.userRepository.save(userDTO);
    }
}
