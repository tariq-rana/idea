import { Injectable, HttpException, HttpStatus, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { UserDTO } from './user.dto';
import { UserRO } from './user.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>){}
    
    
    async findAllUser(): Promise<UserRO[]>{
        
        const users = await this.userRepository.find();

         return users.map( user => {
            return    user.toResponseObject(false);
         });
       
        // const users = await this.userRepository.find();
       // return  users.map(user =>  user.toResponseObject());


    //    const users = await this.userRepository.find();
    //     return users.map( user => {
    //         return    {...user.toResponseObject(true), "bcrypt": bcrypt.hash(user.password,10)}
    //     });
        
    }

    async findOneUser(id:string):Promise<UserRO>{
        const user = await this.userRepository.findOne(id);
        return user.toResponseObject(true);
    }


    // async insertUser(userDTO: UserDTO){
    //     const newUserDTO:UserDTO = Object.assign(new UserEntity(),userDTO);
    //     return await this.userRepository.save(newUserDTO);
    // }

    async login(userDTO: UserDTO):Promise<UserRO>{
        const { username, password } = userDTO;
        const user = await this.userRepository.findOne({where:{username}})

        if(! user || !(await user.comparePassword(password))){
            throw new HttpException('Invalid Username/Password',HttpStatus.BAD_REQUEST);
        }
        return user.toResponseObject(true);

    }

    async register(userDTO: UserDTO):Promise<UserRO>{
        const { username } = userDTO;
        let user = await this.userRepository.findOne({where:{username}})
        if(user){
            throw new HttpException('User already exists',HttpStatus.BAD_REQUEST);
        }
        else{
            user = await this.userRepository.create(userDTO);
            await this.userRepository.save(user);
            return user.toResponseObject(false);
        }
        
    }
}
