import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LogsAccesoService } from './logs-acceso.service';
import { LogsAccesoController } from './logs-acceso.controller';
import { LogsAcceso } from './entities/logs-acceso.entity';

@Module({
  // Use the entity name string to avoid a hard import that may not exist at compile time
  imports: [TypeOrmModule.forFeature([LogsAcceso])],
  controllers: [LogsAccesoController],
  providers: [LogsAccesoService],
})
export class LogsAccesoModule {}

