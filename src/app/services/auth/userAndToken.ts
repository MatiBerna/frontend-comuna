import { Person } from 'src/app/models/person';
import { Admin } from '../../models/admin';

export interface UserAndToken {
  data: Admin | Person;
  tokenSession: string;
}
