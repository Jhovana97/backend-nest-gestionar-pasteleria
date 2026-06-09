import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
  ) {}

  // 🟢 CREATE
  async create(dto: CreateClienteDto) {
    const cliente = this.clienteRepo.create(dto);
    return await this.clienteRepo.save(cliente);
  }

  // 🔵 FIND ALL modificado
  async findAll() {
  return await this.clienteRepo.find({
    relations: [
      'pedidos',
      'pedidos.detalles',
      'pedidos.detalles.producto',
      'pedidos.pagos',
    ],
  });
}

  // 🟣 FIND ONE
    async findOne(id: number) {
    const cliente = await this.clienteRepo.findOne({
      where: { id },
      relations: [
        'pedidos',
        'pedidos.detalles',
        'pedidos.detalles.producto',
        'pedidos.pagos',
      ],
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return cliente;
  }

  // 🟡 UPDATE
  async update(id: number, dto: UpdateClienteDto) {
    const cliente = await this.findOne(id);

    Object.assign(cliente, dto);

    return await this.clienteRepo.save(cliente);
  }

  // 🔴 DELETE
  async remove(id: number) {
    const cliente = await this.findOne(id);
    return await this.clienteRepo.remove(cliente);
  }
}