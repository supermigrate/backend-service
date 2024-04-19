import { Request } from 'express';
import { User } from '../../modules/user/entities/user.entity';

export interface AuthRequest extends Request {
  user: User;
}
