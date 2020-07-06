import { Controller, Post, Body } from '@nestjs/common';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';

import { ArtistInfoInput } from '@interfaces/artist-info-input';
import { ArtistInfoService } from './artist-info.service';
import { ARTISTS } from './artist-info.constants';

@Controller('artistsInfo')
export class ArtistInfoController {
  constructor(private artistInfoService: ArtistInfoService) {}

  @Post()
  create(@Body() data: ArtistInfoInput): Observable<any> {
    console.log('[POST] /artistInfo -d ', data);
    if (data.ids.length > ARTISTS.MAX_ALLOWED_ARTISTS) {
      return of('Exceeded the maximum number of artist id\'s allowed, please try with 5 or less artist\'s');
    }

    const completeData: ArtistInfoInput= {
      ids: data.ids,
      order_by: data.order_by || ARTISTS.DEFAULT_ORDER_BY,
      valid_for: data.valid_for || ARTISTS.DEFAULT_VALID_FOR
    };

    return this.artistInfoService.search(completeData)
  }
}
