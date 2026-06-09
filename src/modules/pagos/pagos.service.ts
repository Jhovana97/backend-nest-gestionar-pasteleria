import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pago } from './entities/pago.entity';
import { Pedido, EstadoPedido } from '../pedidos/entities/pedido.entity';
import { CreatePagoDto } from './dto/create-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private pagoRepo: Repository<Pago>,

    @InjectRepository(Pedido)
    private pedidoRepo: Repository<Pedido>,
  ) { }

  // 🟢 CREATE PAGO
  async create(dto: CreatePagoDto) {
    console.log('📥 DTO RECIBIDO:', dto);

    // 1. Buscar pedido con pagos
    const pedido = await this.pedidoRepo.findOne({
      where: { id: dto.pedidoId },
      relations: ['pagos'],
    });

    console.log('📦 PEDIDO ENCONTRADO:', pedido);

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    // 2. Calcular total pagado
    const totalPagado = pedido.pagos.reduce(
      (sum, p) => sum + Number(p.monto),
      0,
    );

    console.log('💰 TOTAL PAGADO ANTES:', totalPagado);

    const nuevoTotal = totalPagado + Number(dto.monto);

    console.log('🧮 NUEVO TOTAL:', nuevoTotal);
    console.log('📊 TOTAL PEDIDO:', Number(pedido.total));

    // 3. Validación de sobrepago
    if (nuevoTotal > Number(pedido.total)) {
      throw new BadRequestException('El pago excede el total del pedido');
    }

    // 4. Crear pago (IMPORTANTE: FK directa)
    const pago = this.pagoRepo.create({
      monto: Number(dto.monto).toFixed(2),
      metodo: dto.metodo,
      fecha: dto.fecha,
      pedido: { id: dto.pedidoId } as any,
    });

    console.log('🧾 PAGO A GUARDAR:', pago);

    const saved = await this.pagoRepo.save(pago);

    console.log('💾 PAGO GUARDADO:', saved);

    // 5. TRAER RESULTADO COMPLETO (pedido incluido)
    const result = await this.pagoRepo.findOne({
      where: { id: saved.id },
      relations: ['pedido'],
    });

    console.log('📤 RESULT FINAL:', result);

    return result;
  }

  // 🔵 FIND ALL
  async findAll() {
    return this.pagoRepo.find({
      relations: ['pedido'],
    });
  }

  // 🟣 FIND ONE
  async findOne(id: number) {
    const pago = await this.pagoRepo.findOne({
      where: { id },
      relations: ['pedido', 'pedido.pagos'],
    });

    if (!pago) {
      throw new NotFoundException('Pago no encontrado');
    }

    return pago;
  }

  // 🔴 DELETE
  async remove(id: number) {
    const pago = await this.findOne(id);
    return this.pagoRepo.remove(pago);
  }
}