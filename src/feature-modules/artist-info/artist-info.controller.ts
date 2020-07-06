import { Controller, Post, Body } from '@nestjs/common';

import { ArtistInfoService } from './artist-info.service';

@Controller('artistsInfo')
export class ArtistInfoController {
  constructor(private artistInfoService: ArtistInfoService) {}

  @Post()
  create(@Body() data) {
    console.log(data);
    
    return this.artistInfoService.search(data.ids)
  }
}
