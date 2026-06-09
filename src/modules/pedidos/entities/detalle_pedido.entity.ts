import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Pedido } from "./pedido.entity";
import { Producto } from "../../productos/entities/producto.entity";

@Entity('detalle_pedido')
export class DetallePedido {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    cantidad: number;

    @Column('decimal', { precision: 10, scale: 2 })
    precio: string;

    @Column({ nullable: true })
    observacion: string;

    @ManyToOne(() => Pedido, pedido => pedido.detalles)
    @JoinColumn({ name: 'pedido_id' })
    pedido: Pedido;

    @ManyToOne(() => Producto, producto => producto.detalles)
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}