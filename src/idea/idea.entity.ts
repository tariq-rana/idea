import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,  ManyToOne} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({name:"idea"})
export class IdeaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;
    
    @UpdateDateColumn()
    updated:Date;

    @Column({
        length:100
    })
    idea:  string;

    @Column()
    description:  string;

    @ManyToOne(type => UserEntity, user=> user.ideas)
    author: UserEntity;
}