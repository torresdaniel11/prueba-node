import { Module } from '@nestjs/common';

import { ArtistInfoController } from './artist-info.controller';
import { ArtistInfoService } from './artist-info.service';

@Module({
  controllers: [ArtistInfoController],
  providers: [ArtistInfoService]
})
export class ArtistInfoModule {}
