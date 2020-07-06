import { Test, TestingModule } from '@nestjs/testing';
import { SpecialSearchService } from './special-search.service';

describe('SpecialSearchService', () => {
  let service: SpecialSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialSearchService],
    }).compile();

    service = module.get<SpecialSearchService>(SpecialSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
