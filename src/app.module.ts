import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistInfoModule } from './feature-modules/artist-info/artist-info.module';
import { CoreModule } from './core/core.module';
import { SpecialSearchModule } from './feature-modules/special-search/special-search.module';

@Module({
  imports: [CoreModule, SpecialSearchModule, ArtistInfoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
