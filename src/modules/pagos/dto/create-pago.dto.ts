import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { MetodoPago } from '../entities/pago.entity';

export class CreatePagoDto {
  @IsNumber()
  monto: number;

  @IsEnum(MetodoPago)
  metodo: MetodoPago;

  @IsDateString()
  fecha: Date;

  @IsNumber()
  pedidoId: number;
}