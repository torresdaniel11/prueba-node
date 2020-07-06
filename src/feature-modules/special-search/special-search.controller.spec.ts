import { Test, TestingModule } from '@nestjs/testing';
import { SpecialSearchController } from './special-search.controller';

describe('SpecialSearch Controller', () => {
  let controller: SpecialSearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialSearchController],
    }).compile();

    controller = module.get<SpecialSearchController>(SpecialSearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
