import { Injectable, HttpException, HttpStatus, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { UserDTO } from './user.dto';
import { UserRO } from './user.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) { }


    async findAllUser(page: number = 1): Promise<UserRO[]> {
        const users = await this.userRepository.find(
            {
                relations: ['ideas', 'bookmarks'],
                take: 25,
                skip: 25 * (page - 1)
            });

        return users.map(user => {
            return user.toResponseObject(false);
        });

    }

    async findOneUser(id: string): Promise<UserRO> {
        const user = await this.userRepository.findOne(id, { relations: ['ideas', 'bookmarks'] });
        return user.toResponseObject(true);
    }
    async findOneUserByName(username: string): Promise<UserRO> {
        const user = await this.userRepository.findOne({ where: { username }, relations: ['ideas', 'bookmarks'] });
        return user.toResponseObject(false);
    }

    async login(userDTO: UserDTO): Promise<UserRO> {
        const { username, password } = userDTO;
        const user = await this.userRepository.findOne({ where: { username } })

        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException('Invalid Username/Password', HttpStatus.BAD_REQUEST);
        }
        return user.toResponseObject(true);

    }

    async register(userDTO: UserDTO): Promise<UserRO> {
        const { username } = userDTO;
        let user = await this.userRepository.findOne({ where: { username } })
        if (user) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        else {
            user = await this.userRepository.create(userDTO);
            await this.userRepository.save(user);
            return user.toResponseObject(true);
        }

    }
}
