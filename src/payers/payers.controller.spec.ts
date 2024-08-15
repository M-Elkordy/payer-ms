import { Test, TestingModule } from '@nestjs/testing';
import { PayersController } from './payers.controller';

describe('PayersController', () => {
  let controller: PayersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayersController],
    }).compile();

    controller = module.get<PayersController>(PayersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
