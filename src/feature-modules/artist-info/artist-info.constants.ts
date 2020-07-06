const ARTIST_INFO = {
    PARAM_KEY: '{artistId}',
    ARTIST_ENDPOINT: 'https://api.spotify.com/v1/artists/{artistId}',
    ALBUMS_ENDPOINT: 'https://api.spotify.com/v1/artists/{artistId}/albums',
    RELATED_ARTIST_ENDPOINT: 'https://api.spotify.com/v1/artists/{artistId}/related-artists',
    ALBUMS_LIMIT: 3,
    RELATED_ARTIST_LIMIT: 3
}

export const ARTISTS = ARTIST_INFO;