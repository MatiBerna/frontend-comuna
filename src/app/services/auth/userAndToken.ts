import { Admin } from '../../models/admin';

export interface UserAndToken {
  data: Admin;
  tokenSession: string;
}
