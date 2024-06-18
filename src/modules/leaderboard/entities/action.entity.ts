import {
    Column,
    CreateDateColumn,
    Entity,
    ObjectIdColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('actions')
export class Action {
    @ObjectIdColumn()
    id: string;

    @Column()
    name: 'CASTS' | 'SUBSCRIPTION' | 'FOLLOW' | 'REPLY';

    @Column()
    description: string;

    @Column()
    points: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    is_active: boolean
}
