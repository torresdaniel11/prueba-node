import { Album } from "./album";
import { RelatedArtist } from "./related-artist";

export interface Artist {
  spotify_url: string;
  name: string;
  followers: number;
  popularity: number;
  albums: Album[];
  relared_artist: RelatedArtist[];
}
