import { Test, TestingModule } from '@nestjs/testing';
import { SmtpConfigsResolver } from './smtp-configs.resolver';
import { SmtpConfigsService } from './smtp-configs.service';

describe('SmtpConfigsResolver', () => {
  let resolver: SmtpConfigsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmtpConfigsResolver, SmtpConfigsService],
    }).compile();

    resolver = module.get<SmtpConfigsResolver>(SmtpConfigsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
