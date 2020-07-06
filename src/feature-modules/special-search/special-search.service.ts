import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Injectable, HttpService } from '@nestjs/common';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { SEARCH_CONST } from './special-search.constants';
import { SpotifyAuthService } from '@services/spotify-auth/spotify-auth.service';

@Injectable()
export class SpecialSearchService {
  constructor(
    private http: HttpService,
    private spotifyAuth: SpotifyAuthService,
  ) {}

  /**
   * request a new spotify auth token and call API query
   *
   * @param {string} criteria user query input
   * @returns {Observable<any>}
   */
  search(criteria: string): Observable<any> {
    return this.spotifyAuth.getToken().pipe(
      switchMap((token: string) => this.doSearch(criteria, token)),
    );
  }

  /**
   * make the spotify API request
   *
   * @param {string} criteria user query input
   * @param {string} token spotify app auth access token
   * @returns {Observable<AxiosResponse<any>>}
   */
  private doSearch( criteria: string, token: string, ): Observable<AxiosResponse<any>> {
    const url = `${ SEARCH_CONST.ENDPOINT }?q=${criteria}&type=${SEARCH_CONST.SEARCH_ITEMS.join(',')}&limit=${ SEARCH_CONST.LIMIT }&offset=${SEARCH_CONST.OFFSET}`;
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return this.http.get(url, config).pipe(
      catchError((error: any) => error),
      map((response: AxiosResponse) => response.data),
    );
  }
}
