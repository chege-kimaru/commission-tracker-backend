import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  public static isLocalhost(req: any) {
    return (
      String(req.headers.host).indexOf('localhost') > -1 ||
      String(req.headers.host).indexOf('127.0.0.1') > -1
    );
  }
}
