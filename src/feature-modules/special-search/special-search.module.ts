import { Module } from '@nestjs/common';

import { SpecialSearchController } from './special-search.controller';
import { SpecialSearchService } from './special-search.service';

@Module({
  providers: [SpecialSearchService],
  controllers: [SpecialSearchController],
  imports: []
})
export class SpecialSearchModule { }
