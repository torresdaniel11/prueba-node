import { Test, TestingModule } from '@nestjs/testing';
import { ArtistInfoService } from './artist-info.service';

describe('ArtistInfoService', () => {
  let service: ArtistInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtistInfoService],
    }).compile();

    service = module.get<ArtistInfoService>(ArtistInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
