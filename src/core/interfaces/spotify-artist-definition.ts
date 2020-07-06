import { SpotifyImage } from "./spotify-image";

export interface SpotifyArtistDefinition {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: 59;
  type: string;
  uri: string;
}

