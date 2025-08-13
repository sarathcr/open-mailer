import { Test, TestingModule } from '@nestjs/testing';
import { ApiTokenResolver } from './api-token.resolver';
import { ApiTokenService } from './api-token.service';

describe('ApiTokenResolver', () => {
  let resolver: ApiTokenResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiTokenResolver, ApiTokenService],
    }).compile();

    resolver = module.get<ApiTokenResolver>(ApiTokenResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
