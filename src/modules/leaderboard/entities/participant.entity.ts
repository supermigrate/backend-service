import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm";
import { Action } from "./action.entity";



@Entity("participant_activities")
export class Activity {
    @ObjectIdColumn()
    id: string;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    action: Action[]


}




@Entity("ranking_participants")
export class Participant {
    @ObjectIdColumn()
    id: string;

    @Column()
    address: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    activities: Activity[]
}