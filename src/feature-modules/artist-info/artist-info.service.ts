import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Injectable, HttpService } from '@nestjs/common';
import { map, switchMap, retry } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';

import { Album } from '@interfaces/album';
import { Artist } from '@interfaces/artist';
import { ArtistInfoInput } from '@interfaces/artist-info-input';
import { ARTISTS } from './artist-info.constants';
import { ArtistsResponse } from '@interfaces/artist-response';
import { RelatedArtist } from '@interfaces/related-artist';
import { SpotifyAlbumDefinition } from '@interfaces/spotify-album-definition';
import { SpotifyAlbumsApiResponse } from '@interfaces/spotify-albums-api-response';
import { SpotifyArtistDefinition } from '@interfaces/spotify-artist-definition';
import { SpotifyAuthService } from '@services/spotify-auth/spotify-auth.service';
import { SpotifyRelatedArtistDefinition } from '@interfaces/spotify-related-artist-definition';

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
  search(criteria: ArtistInfoInput): Observable<any> {
    return this.spotifyAuth
      .getToken()
      .pipe(switchMap((token: string) => this.doSearch(criteria, token)));
  }

  /**
   * make parallel request for all the artist's information by the given array of artists id
   *
   * @private
   * @param {string[]} criteria
   * @param {string} token
   * @returns {Observable<any>}
   */
  private doSearch(criteria: ArtistInfoInput, token: string): Observable<ArtistsResponse> {
    const config = this.getRequestConfig(token);
    const reqs = criteria.ids.map((artistId: string) => {
      return this.buildSingleArtist(artistId, config);
    });

    return forkJoin(reqs).pipe(
      map((data) => this.convertDataToOutput(data, criteria))
    );
  }

  /**
   * make the parallel request for artist, albums and related artist for the given artist id
   *
   * @private
   * @param {string} artistId
   * @param {AxiosRequestConfig} config
   * @returns {Observable<any>}
   */
  private buildSingleArtist( artistId: string, config: AxiosRequestConfig, ): Observable<any> {
    const reqs = [];

    reqs.push(this.getArtist(artistId, config));
    reqs.push(this.getArtistAlbums(artistId, config));
    reqs.push(this.getRelatedArtist(artistId, config));

    return forkJoin(reqs);
  }

  /**
   * get an spotify artist for the given artist id
   *
   * @private
   * @param {string} artistId
   * @param {AxiosRequestConfig} config
   * @returns {Observable<any>}
   */
  private getArtist( artistId: string, config: AxiosRequestConfig, ): Observable<SpotifyArtistDefinition> {
    const url = ARTISTS.ARTIST_ENDPOINT.replace(ARTISTS.PARAM_KEY, artistId);
    console.log('getArtist ', url);

    return this.http.get(url, config).pipe(
      retry(ARTISTS.MAX_RETRYS),
      map((response: AxiosResponse): SpotifyArtistDefinition => response.data)
    );
  }

  /**
   * get artist albums for the given artist id
   *
   * @private
   * @param {string} artistId
   * @param {AxiosRequestConfig} config
   * @returns {Observable<any>}
   */
  private getArtistAlbums( artistId: string, config: AxiosRequestConfig, ): Observable<SpotifyAlbumsApiResponse> {
    const url = `${ARTISTS.ALBUMS_ENDPOINT.replace( ARTISTS.PARAM_KEY, artistId, )}?limit=${ARTISTS.ALBUMS_LIMIT}`;
    console.log('getArtistAlbum ', url);

    return this.http.get(url, config).pipe(
        retry(ARTISTS.MAX_RETRYS),
        map((response: AxiosResponse) => response.data)
      );
  }

  /**
   * get related artist for the given artist id
   *
   * @private
   * @param {string} artistId
   * @param {AxiosRequestConfig} config
   * @returns {Observable<any>}
   */
  private getRelatedArtist( artistId: string, config: AxiosRequestConfig ): Observable<SpotifyRelatedArtistDefinition> {
    const url = ARTISTS.RELATED_ARTIST_ENDPOINT.replace( ARTISTS.PARAM_KEY, artistId);
    console.log('getRelatedArtist ', url);

    return this.http.get(url, config).pipe(
      retry(ARTISTS.MAX_RETRYS),
      map((response: AxiosResponse) => response.data)
    );
  }

  private convertDataToOutput(data: any[], criteria: ArtistInfoInput): ArtistsResponse {
    let genres: string[] = [];
    let distinctGenres: string[] = [];

    const artists = data.map((artistInfo: any[]): Artist => {
        let albums: Album[] = [];
        let relatedArtist: RelatedArtist[] = [];
        const spotifyArtist: SpotifyArtistDefinition = artistInfo[0];
        const spotifyAlbums: SpotifyAlbumsApiResponse = artistInfo[1];
        const spotifyRelatedArtist: SpotifyRelatedArtistDefinition = artistInfo[2];

        this.sortArtists(spotifyRelatedArtist.artists, criteria.order_by);
        spotifyRelatedArtist.artists = spotifyRelatedArtist.artists.slice(0, ARTISTS.RELATED_ARTIST_LIMIT);

        albums = spotifyAlbums.items.map((spAlbum: SpotifyAlbumDefinition): Album => this.mapAlbumDefinition(spAlbum, criteria.valid_for));
        relatedArtist = spotifyRelatedArtist.artists.map((spArtist: SpotifyArtistDefinition) => {
            genres = genres.concat(spArtist.genres);

            return this.mapRelatedArtistsDefinition(spArtist);
          },
        );

        genres.concat(spotifyArtist.genres);

        return this.mapArtistDenifition(spotifyArtist, albums, relatedArtist);
      },
    );

    distinctGenres = [...new Set(genres)].sort();

    return { artists: artists, genres: distinctGenres };
  }

  /**
   * sort the artist array based on the given criteria followers || popularity
   *
   * @param {SpotifyArtistDefinition[]} artists
   * @param {string} criteria
   */
  sortArtists(artists: SpotifyArtistDefinition[], criteria: string): void {
    if(criteria === 'followers'){
      artists.sort((a, b) => b.followers.total - a.followers.total);
    } else if ( criteria === 'popularity') {
      artists.sort((a, b) => b.popularity - a.popularity);
    }
  }

  /**
   * get request config (authorization header)
   *
   * @private
   * @param {string} token
   * @returns {AxiosRequestConfig}
   */
  private getRequestConfig(token: string): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  /**
   * convert an spotify artist definition to an Artist instance
   *
   * @private
   * @param {SpotifyArtistDefinition} spotifyArtist
   * @returns {Artist}
   */
  private mapArtistDenifition( spotifyArtist: SpotifyArtistDefinition, albums?: Album[], relatedArtist?: RelatedArtist[] ): Artist {
    return {
      spotify_url: spotifyArtist.external_urls.spotify,
      name: spotifyArtist.name,
      followers: spotifyArtist.followers.total,
      popularity: spotifyArtist.popularity,
      albums: albums || [],
      relared_artist: relatedArtist || [],
    };
  }

  /**
   * convert an spotify album definition to an Album instance
   * calculate is_available by checking if any of the valid_for parameter value is present in the album available_markest array 
   *
   * @private
   * @param {SpotifyAlbumDefinition} spotifyAlbum
   * @param {string} [valid_for=ARTISTS.DEFAULT_VALID_FOR]
   * @returns {Album}
   */
  private mapAlbumDefinition( spotifyAlbum: SpotifyAlbumDefinition, valid_for: string[] = ARTISTS.DEFAULT_VALID_FOR ): Album {
    const isValid: boolean = spotifyAlbum.available_markets.some((location: string) => valid_for.includes(location));

    return {
      name: spotifyAlbum.name,
      release_date: spotifyAlbum.release_date,
      type: spotifyAlbum.type,
      is_available: isValid,
    };
  }

  /**
   * convert an spotifyArtist into an RelatedArtist
   *
   * @private
   * @param {SpotifyArtistDefinition} spotifyArtist
   * @returns {RelatedArtist}
   */
  private mapRelatedArtistsDefinition( spotifyArtist: SpotifyArtistDefinition, ): RelatedArtist {
    return {
      name: spotifyArtist.name,
      followers: spotifyArtist.followers.total,
      popularity: spotifyArtist.popularity,
    };
  }
}
