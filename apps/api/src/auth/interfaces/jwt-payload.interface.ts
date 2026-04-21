import { Role, User } from '../../../generated/prisma/client';

export class JwtPayload {
  id!: string;
  email!: string;
  sub!: string;
  role!: Role;
}

export interface RequestWithUser extends Request {
  user: User | JwtPayload;
}
