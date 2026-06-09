import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsString()
  precio: string;

  @IsString()
  estado: string;

  @IsString()
  tipo: string;

  @IsNumber()
  categoriaId: number;
}