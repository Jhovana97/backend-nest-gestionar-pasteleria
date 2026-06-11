import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,} from 'typeorm';

@Entity('logs_acceso')
export class LogsAcceso {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    usuario: string;

    @Column()
    ip: string;

    @Column()
    evento: string;

    @Column()
    browser: string;

    @CreateDateColumn()
    fechaHora: Date;
}