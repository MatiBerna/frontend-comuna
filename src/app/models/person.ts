export interface Person {
  _id: string | null;
  dni: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string;
  birthdate: Date;
  password?: string;
}
