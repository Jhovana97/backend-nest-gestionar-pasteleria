import { Injectable } from '@nestjs/common';
import { CreateLogsAccesoDto } from './dto/create-logs-acceso.dto';
import { UpdateLogsAccesoDto } from './dto/update-logs-acceso.dto';

@Injectable()
export class LogsAccesoService {
  create(createLogsAccesoDto: CreateLogsAccesoDto) {
    return 'This action adds a new logsAcceso';
  }

  findAll() {
    return `This action returns all logsAcceso`;
  }

  findOne(id: number) {
    return `This action returns a #${id} logsAcceso`;
  }

  update(id: number, updateLogsAccesoDto: UpdateLogsAccesoDto) {
    return `This action updates a #${id} logsAcceso`;
  }

  remove(id: number) {
    return `This action removes a #${id} logsAcceso`;
  }
}
