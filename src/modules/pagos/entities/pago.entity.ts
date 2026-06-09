import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Pedido } from "../../pedidos/entities/pedido.entity";

export enum MetodoPago {
    EFECTIVO = 'efectivo',
    TARJETA = 'tarjeta',
    TRANSFERENCIA = 'transferencia'
}

@Entity('pagos')
export class Pago {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    monto: string;

    @Column({
        type: 'enum',
        enum: MetodoPago
    })
    metodo: MetodoPago;

    @Column({ type: 'timestamp' })
    fecha: Date;

    @ManyToOne(() => Pedido, pedido => pedido.pagos)
    @JoinColumn({ name: 'pedido_id' })
    pedido: Pedido;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}