import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Injectable, HttpService } from '@nestjs/common';
import { map, retry } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { SPOTIFY_AUTH } from './spotify-auth-constants';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const qs = require('qs');
@Injectable()
export class SpotifyAuthService {
  data = qs.stringify({
    grant_type: SPOTIFY_AUTH.BODY.value,
  });

  config: AxiosRequestConfig = {
    headers: {
      Authorization: SPOTIFY_AUTH.AUTH_HEADER.value,
      'Content-Type': SPOTIFY_AUTH.CONTENT_TYPE,
    },
    data: this.data,
  };

  constructor(private http: HttpService) {}

  /**
   * request an access token to the spotify API
   *
   * @returns {Observable<AxiosResponse<any>>}
   */
  getToken(): Observable<any> {
    return this.http.post(SPOTIFY_AUTH.AUTH_URL, this.data, this.config).pipe(
      retry(3),
      map((response: AxiosResponse<any>): string => response.data.access_token)
    );
  }
}
