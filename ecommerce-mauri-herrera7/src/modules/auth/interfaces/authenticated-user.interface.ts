import { Role } from '../../../roles.enum';

export interface AuthenticatedUser {
  id: string;
  email: string;
  isAdmin: boolean;
  roles: Role[];
  iat?: number;
  exp?: number;
}
