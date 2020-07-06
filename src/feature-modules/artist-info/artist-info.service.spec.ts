import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ArtistInfoService } from './artist-info.service';
import { SpotifyAuthService } from '@services/spotify-auth/spotify-auth.service';

describe('ArtistInfoService', () => {
  let service: ArtistInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtistInfoService, SpotifyAuthService],
      imports: [HttpModule]
    }).compile();

    service = module.get<ArtistInfoService>(ArtistInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
