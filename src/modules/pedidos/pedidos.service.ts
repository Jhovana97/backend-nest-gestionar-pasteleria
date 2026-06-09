import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Pedido, EstadoPedido } from './entities/pedido.entity';
import { DetallePedido } from './entities/detalle_pedido.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
//crear pdf
import PDFDocument from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepo: Repository<Pedido>,

    @InjectRepository(DetallePedido)
    private detalleRepo: Repository<DetallePedido>,

    @InjectRepository(Producto)
    private productoRepo: Repository<Producto>,

    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,

    private dataSource: DataSource,
  ) { }

  // 🟢 CREATE PEDIDO CON DETALLES
  async create(dto: CreatePedidoDto) {
    return this.dataSource.transaction(async manager => {

      const cliente = await manager.findOneBy(Cliente, {
        id: dto.clienteId,
      });

      if (!cliente) {
        throw new NotFoundException('Cliente no encontrado');
      }

      const pedido = manager.create(Pedido, {
        fecha: dto.fecha,
        fecha_entrega: dto.fecha_entrega,
        cliente,
        estado: EstadoPedido.PENDIENTE,
        total: '0',
      });

      const savedPedido = await manager.save(pedido);

      let total = 0;

      for (const item of dto.detalles) {

        const producto = await manager.findOneBy(Producto, {
          id: item.productoId,
        });

        if (!producto) {
          throw new NotFoundException('Producto no encontrado');
        }

        const subtotal = item.cantidad * item.precio;
        total += subtotal;

        const detalle = manager.create(DetallePedido, {
          cantidad: item.cantidad,
          precio: item.precio.toString(),
          pedido: savedPedido,
          producto,
        });

        await manager.save(detalle);
      }

      savedPedido.total = total.toFixed(2);
      await manager.save(savedPedido);

      return manager.findOne(Pedido, {
        where: { id: savedPedido.id },
        relations: [
          'cliente',
          'detalles',
          'detalles.producto',
        ],
      });
    });
  }

  // 🔵 GET ALL
  async findAll() {
  const pedidos = await this.pedidoRepo.find({
    relations: ['cliente', 'detalles', 'detalles.producto', 'pagos'],
  });

  return pedidos.map((pedido) => {
    const pagado = (pedido.pagos ?? []).reduce(
      (sum, p) => sum + Number(p.monto || 0),
      0,
    );

    const total = Number(pedido.total || 0);
    const restante = total - pagado;

    // 🔥 ESTADO CORRECTO (ENUM)
    let estado: EstadoPedido = pedido.estado;

    if (pagado >= total && total > 0) {
      estado = EstadoPedido.ENTREGADO;
    } else {
      estado = EstadoPedido.PENDIENTE;
    }

    return {
      ...pedido,
      pagado,
      restante: restante < 0 ? 0 : restante,
      estado,
    };
  });
}

  // 🟣 GET ONE
  async findOne(id: number) {
    const pedido = await this.pedidoRepo.findOne({
      where: { id },
      relations: ['cliente', 'detalles', 'detalles.producto'],
    });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return pedido;
  }

  // 🟡 UPDATE (básico)
  async update(id: number, dto: UpdatePedidoDto) {
    const pedido = await this.findOne(id);

    Object.assign(pedido, dto);

    return this.pedidoRepo.save(pedido);
  }

  // 🔴 DELETE
  async remove(id: number) {
    const pedido = await this.findOne(id);
    return this.pedidoRepo.remove(pedido);
  }
  //apra genrar pdf
  async generatePdf(id: number, res: Response) {

  const pedido = await this.pedidoRepo.findOne({
    where: { id },
    relations: [
      'cliente',
      'detalles',
      'detalles.producto',
      'pagos'
    ]
  });

  if (!pedido) {
    throw new NotFoundException('Pedido no encontrado');
  }

  const doc = new PDFDocument();

  res.setHeader(
    'Content-Type',
    'application/pdf',
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename=pedido-${id}.pdf`,
  );

  doc.pipe(res);

  doc.fontSize(20)
     .text('REPORTE DE PEDIDO');

  doc.moveDown();

  doc.fontSize(12)
    .text(`Pedido N°: ${pedido.id}`);
  doc.text(`Cliente: ${pedido.cliente.nombre}`);
  doc.text(`Telefono: ${pedido.cliente.telefono}`);
  doc.text(`Direccion: ${pedido.cliente.direccion}`);
  doc.text(`Fecha entrega: ${pedido.fecha_entrega}`);
  doc.text(`Estado: ${pedido.estado}`);
  doc.moveDown();

  doc.text('PRODUCTOS');

  doc.moveDown();

  pedido.detalles.forEach(detalle => {

    doc.text(
      `${detalle.producto.nombre}
       | Cantidad: ${detalle.cantidad}
       | Precio: ${detalle.precio} Bs`
    );

  });

  doc.moveDown();
  doc.text(`TOTAL: ${pedido.total} Bs`);
  doc.moveDown();
  doc.text('PAGOS');

  let totalPagado = 0;

  pedido.pagos.forEach(pago => {
    totalPagado += Number(pago.monto);
    doc.text(
      `${pago.metodo} - ${pago.monto} Bs`
    );
  });

  doc.moveDown();
  doc.text(`Pagado: ${totalPagado} Bs`);
  doc.text(
    `Restante: ${
      Number(pedido.total) - totalPagado
    } Bs`
  );

  doc.end();
}
}