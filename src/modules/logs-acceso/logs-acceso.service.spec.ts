import { Test, TestingModule } from '@nestjs/testing';
import { LogsAccesoService } from './logs-acceso.service';

describe('LogsAccesoService', () => {
  let service: LogsAccesoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsAccesoService],
    }).compile();

    service = module.get<LogsAccesoService>(LogsAccesoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
