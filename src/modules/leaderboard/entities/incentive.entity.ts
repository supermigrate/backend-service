import {
    Column,
    CreateDateColumn,
    Entity,
    ObjectIdColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Action } from './action.entity';

@Entity('incentives')
export class Incentive {
    @ObjectIdColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    is_ative: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    actions: Action[]
}
