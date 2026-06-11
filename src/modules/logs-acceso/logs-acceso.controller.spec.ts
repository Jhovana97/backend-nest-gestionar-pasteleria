import { Test, TestingModule } from '@nestjs/testing';
import { LogsAccesoController } from './logs-acceso.controller';
import { LogsAccesoService } from './logs-acceso.service';

describe('LogsAccesoController', () => {
  let controller: LogsAccesoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsAccesoController],
      providers: [LogsAccesoService],
    }).compile();

    controller = module.get<LogsAccesoController>(LogsAccesoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
