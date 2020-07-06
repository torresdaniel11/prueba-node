import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class SpotifyAuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log("por aca socio")
    next();
  }
}
