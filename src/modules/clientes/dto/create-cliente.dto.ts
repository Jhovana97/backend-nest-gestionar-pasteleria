import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  telefono: string;

  @IsString()
  direccion: string;
}