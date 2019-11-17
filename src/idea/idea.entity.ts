import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, 
     ManyToOne,
     ManyToMany,
     JoinTable,
     OneToMany} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from '../comment/comment.entity';

@Entity({name:"idea"})
export class IdeaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;
    
    @UpdateDateColumn()
    updated:Date;

    @Column()
    idea:  string;

    @Column({
        length: 4000
    })
    description:  string;

    @ManyToOne(type => UserEntity, user=> user.ideas)
    author: UserEntity;

    @ManyToMany(type => UserEntity,{cascade:true})
    @JoinTable()
    upvotes: UserEntity[];

    @ManyToMany(type => UserEntity,{cascade:true})
    @JoinTable()
    downvotes: UserEntity[];

    @OneToMany(type => CommentEntity, comment => comment.idea, {cascade : true})
    comments: CommentEntity[];
}