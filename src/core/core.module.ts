import { SpotifyAuthService } from '@services/spotify-auth/spotify-auth.service';
import { Module, HttpModule, Global } from '@nestjs/common';

@Global()
@Module({
  imports: [HttpModule],
  providers: [SpotifyAuthService],
  exports: [HttpModule, SpotifyAuthService]
})
export class CoreModule {}
