import { User } from '../../domain/user/entities/user.entity';
import type { Request as ExpressRequest } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }

  interface Request extends ExpressRequest {
    user: User;
  }
}
