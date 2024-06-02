import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { env } from '../config/env';

@Injectable()
export class SanitizerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() as Request;

    const origin = req.get('origin') as string;

    if (!env.isProduction || !env.isStaging || origin.includes('localhost')) {
      return true;
    }

    if (origin !== env.client.origin) {
      return false;
    }

    return true;
  }
}
