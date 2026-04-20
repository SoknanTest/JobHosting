import { Role } from '../../../generated/prisma/client';

export class JwtPayload {
  email: string;
  sub: string;
  role: Role;
}

export class RequestWithUser extends Request {
  user: JwtPayload;
}
