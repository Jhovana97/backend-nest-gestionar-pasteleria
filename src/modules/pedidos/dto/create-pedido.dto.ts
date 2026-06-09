import { IsArray, IsDateString, IsNumber, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePedidoDetalleDto {
  @IsNumber()
  productoId: number;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio: number;

  @IsOptional()
  @IsString()
  observacion?: string;
}

export class CreatePedidoDto {
  @IsDateString()
  fecha: Date;

  @IsDateString()
  fecha_entrega: Date;

  @IsNumber()
  clienteId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoDetalleDto)
  detalles: CreatePedidoDetalleDto[];
}