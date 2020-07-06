import { Artist } from './artist';

export interface ArtistsResponse {
  artists: Artist[];
  genres: string[];
}
