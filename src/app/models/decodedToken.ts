import { Admin } from './admin';
import { Person } from './person';

export interface DecodedToken {
  user: Admin | Person;
  iat: number;
  exp: number;
}
