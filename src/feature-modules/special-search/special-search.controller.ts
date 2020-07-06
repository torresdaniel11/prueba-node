import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';

import { SpecialSearchService } from './special-search.service';

@Controller('special-search')
export class SpecialSearchController {
  constructor(private specialSearchService: SpecialSearchService) {}

  /**
   * GET /special-search?q=:q
   *
   * @param {*} id
   * @returns {Observable<any>}
   */
  @Get()
  search(@Query('q') q: string): Observable<any> {
    return this.specialSearchService.search(q);
  }
}
