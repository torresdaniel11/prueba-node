import { SpotifyAuthMiddleware } from './spotify-auth.middleware';

describe('SpotifyAuthMiddleware', () => {
  it('should be defined', () => {
    expect(new SpotifyAuthMiddleware()).toBeDefined();
  });
});
