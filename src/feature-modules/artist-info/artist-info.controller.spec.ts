import { Test, TestingModule } from '@nestjs/testing';
import { ArtistInfoController } from './artist-info.controller';

describe('ArtistInfo Controller', () => {
  let controller: ArtistInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistInfoController],
    }).compile();

    controller = module.get<ArtistInfoController>(ArtistInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
