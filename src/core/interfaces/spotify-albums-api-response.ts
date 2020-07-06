import { SpotifyAlbumDefinition } from './spotify-album-definition';

export interface SpotifyAlbumsApiResponse {
  href: string;
  items: SpotifyAlbumDefinition[];
  limit: number;
  next: string;
  offset: string;
  previous: string;
  total: number;
}
