import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';

import { Pedido } from './entities/pedido.entity';
import { DetallePedido } from './entities/detalle_pedido.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pedido,
      DetallePedido,
      Producto,
      Cliente,
    ]),
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}