const SPOTIFY = {
  AUTH_URL: 'https://accounts.spotify.com/api/token',
  CONTENT_TYPE: 'application/x-www-form-urlencoded',
  AUTH_HEADER: {
    key: 'Authorization',
    value: 'Basic NGM1MWI2OWE1YmM1NDY2NzgyYjYzNTJlNTU3YTFkNGY6NTE2NmMxZmUyNTU0NDE3NTg5ODk1MjU0OGY0NDlkMmM=',
  },
  BODY: {
    key: 'grant_type',
    value: 'client_credentials',
  },
};

export const SPOTIFY_AUTH = SPOTIFY;
