import { Cliente } from "../../clientes/entities/cliente.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { DetallePedido } from "./detalle_pedido.entity";
import { Pago } from "../../pagos/entities/pago.entity";

export enum EstadoPedido {
  PENDIENTE = 'pendiente',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado'
}

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'timestamp' })
  fecha_entrega: Date;

  @Column({
    type: 'enum',
    enum: EstadoPedido,
    default: EstadoPedido.PENDIENTE
  })
  estado: EstadoPedido;

  @Column('decimal', { precision: 10, scale: 2 })
  total: string;

  @ManyToOne(() => Cliente, cliente => cliente.pedidos)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @OneToMany(() => DetallePedido, detalle => detalle.pedido, {
    cascade: true
  })
  detalles: DetallePedido[];

  @OneToMany(() => Pago, pago => pago.pedido)
  pagos: Pago[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}