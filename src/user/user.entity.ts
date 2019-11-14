import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert } from 'typeorm';
import  * as bcrypt  from 'bcryptjs';
import  * as jwt from 'jsonwebtoken';
import { UserRO } from './user.dto';

@Entity({name:"user"})
export class UserEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @Column({
        type: 'nvarchar',
        unique: true
    })
    username:string;

    @Column('text')
    password:string;

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password,10);
    }

    toResponseObject(showToken: boolean = true): UserRO{
        const {id, created, username, token } = this;
        const responseObject:UserRO = {id, created, username};
        if(showToken){
            responseObject.token = token;
        }
        return responseObject;
    }

    async comparePassword(attempt:string ): Promise<boolean>{
        return await bcrypt.compare(attempt, this.password);
    }

    private get token(){
        const {id, username} = this;
        return jwt.sign({id,username},process.env.SECRET_KEY,{expiresIn: '7d'});
    }
}