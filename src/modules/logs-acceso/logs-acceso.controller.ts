import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogsAccesoService } from './logs-acceso.service';
import { CreateLogsAccesoDto } from './dto/create-logs-acceso.dto';
import { UpdateLogsAccesoDto } from './dto/update-logs-acceso.dto';

@Controller('logs-acceso')
export class LogsAccesoController {
  constructor(private readonly logsAccesoService: LogsAccesoService) {}

  @Post()
  create(@Body() createLogsAccesoDto: CreateLogsAccesoDto) {
    return this.logsAccesoService.create(createLogsAccesoDto);
  }

  @Get()
  findAll() {
    return this.logsAccesoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logsAccesoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogsAccesoDto: UpdateLogsAccesoDto) {
    return this.logsAccesoService.update(+id, updateLogsAccesoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logsAccesoService.remove(+id);
  }
}
