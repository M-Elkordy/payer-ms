import { Test, TestingModule } from '@nestjs/testing';
import { PayersService } from './payers.service';

describe('PayersService', () => {
  let service: PayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayersService],
    }).compile();

    service = module.get<PayersService>(PayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
