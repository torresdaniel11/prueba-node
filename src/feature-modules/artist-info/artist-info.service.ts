
import { SpotifyArtistDefinition } from './../../core/interfaces/spotify-artist-definition';
import { ARTISTS } from './artist-info.constants';
import { Injectable, HttpService } from '@nestjs/common';
import { map, switchMap } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

import { SpotifyAuthService } from 'src/core/services/spotify-auth/spotify-auth.service';
import { Artist } from 'src/core/interfaces/artist';

@Injectable()
export class ArtistInfoService {
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
  search(criteria: string[]): Observable<any> {
    return this.spotifyAuth.getToken().pipe(
      switchMap((token: string) => this.doSearch(criteria, token)),
    );
  }

  private doSearch(criteria: string[], token: string): Observable<any> {
    const config = this.getRequestConfig(token);
    const reqs = criteria.map((artistId: string) => {
      return this.buildSingleArtist(artistId, config);
    })

    return forkJoin(reqs);
  }

  private buildSingleArtist(artistId: string, config: AxiosRequestConfig): Observable<any> {
    const reqs = [];

    reqs.push(this.getArtist(artistId, config));
    reqs.push(this.getArtistAlbums(artistId, config));
    reqs.push(this.getRelatedArtist(artistId, config));
    
    return forkJoin(reqs);
  }

  private getArtist(artistId: string, config: AxiosRequestConfig): Observable<any> {
    const url = ARTISTS.ARTIST_ENDPOINT.replace(ARTISTS.PARAM_KEY, artistId);

    return this.http.get(url, config).pipe(
      map((response: AxiosResponse): SpotifyArtistDefinition => response.data),
      // map((spotifyArtist: SpotifyArtistDefinition): Artist => this.getArtistInstance(spotifyArtist))
    );
  }

  private getArtistAlbums(
    artistId: string,
    config: AxiosRequestConfig,
  ): Observable<any> {
    const url = `${ARTISTS.ALBUMS_ENDPOINT.replace(
      ARTISTS.PARAM_KEY,
      artistId,
    )}?limit=${ARTISTS.ALBUMS_LIMIT}`;

    return this.http.get(url, config);
  }

  private getRelatedArtist(
    artistId: string,
    config: AxiosRequestConfig,
  ): Observable<any> {
    const url = `${ARTISTS.RELATED_ARTIST_ENDPOINT.replace(
      ARTISTS.PARAM_KEY,
      artistId,
    )}?limit=${ARTISTS.RELATED_ARTIST_LIMIT}`;

    return this.http.get(url, config);
  }







  private getRequestConfig(token: string): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }





  private getArtistInstance(spotifyArtist: SpotifyArtistDefinition): Artist {
    return {
      spotify_url: spotifyArtist.external_urls.spotify,
      name: spotifyArtist.name,
      followers: spotifyArtist.followers.total,
      popularity: spotifyArtist.popularity,
      albums: [],
      relared_artist: []
    };
  }
}
