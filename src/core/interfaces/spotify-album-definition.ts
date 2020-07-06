import { SpotifyArtistDefinitionSimple } from './spotify-artist-definition-simple';
import { SpotifyImage } from './spotify-image';

export interface SpotifyAlbumDefinition {
  album_group: string;
  album_type: string;
  artists: SpotifyArtistDefinitionSimple[ ];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
}
