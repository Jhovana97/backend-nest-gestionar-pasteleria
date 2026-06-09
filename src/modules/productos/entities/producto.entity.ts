import { Categoria } from "../../categorias/entities/categoria.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { DetallePedido } from "../../pedidos/entities/detalle_pedido.entity";

@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column('decimal', { precision: 10, scale: 2 })
    precio: string;

    @Column()
    estado: string;

    @Column()
    tipo: string;

    @ManyToOne(() => Categoria, categoria => categoria.productos)
    @JoinColumn({ name: 'categoria_id' })
    categoria: Categoria;

    @OneToMany(() => DetallePedido, detalle => detalle.producto)
    detalles: DetallePedido[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}