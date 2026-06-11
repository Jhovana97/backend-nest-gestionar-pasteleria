import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Categoria } from '../categorias/entities/categoria.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) { }

  async create(dto: CreateProductoDto) {
    const producto = this.productoRepository.create({
      ...dto,
      categoria: { id: dto.categoriaId } as Categoria,
    });

    return await this.productoRepository.save(producto);
  }

  async findAll() {
    return await this.productoRepository.find({
      relations: ['categoria', 'detalles'],
      //withDeleted: true, para ver eliminados
    });
  }

  async findOne(id: number) {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['categoria', 'detalles'],
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  async update(id: number, dto: UpdateProductoDto) {
    const producto = await this.findOne(id);

    const updated = Object.assign(producto, {
      ...dto,
      categoria: dto.categoriaId
        ? ({ id: dto.categoriaId } as Categoria)
        : producto.categoria,
    });

    return await this.productoRepository.save(updated);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);

    await this.productoRepository.softDelete(id);

    return {
      message: 'Producto eliminado correctamente',
    };
  }
}