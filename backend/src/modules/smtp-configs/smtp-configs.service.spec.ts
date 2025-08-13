import { Test, TestingModule } from '@nestjs/testing';
import { SmtpConfigsService } from './smtp-configs.service';

describe('SmtpConfigsService', () => {
  let service: SmtpConfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmtpConfigsService],
    }).compile();

    service = module.get<SmtpConfigsService>(SmtpConfigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
