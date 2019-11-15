import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert,
     OneToMany, ManyToMany, JoinTable } from 'typeorm';
import  * as bcrypt  from 'bcryptjs';
import  * as jwt from 'jsonwebtoken';
import { IdeaEntity } from '../idea/idea.entity';
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

    @OneToMany(type => IdeaEntity, idea => idea.author )
    ideas: IdeaEntity[];

    @ManyToMany(type=>IdeaEntity, {cascade:true})
    @JoinTable()
    bookmarks: IdeaEntity[];


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
        if(this.ideas){
            responseObject.ideas = this.ideas;
        }
        if(this.bookmarks){
            responseObject.bookmarks = this.bookmarks;
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