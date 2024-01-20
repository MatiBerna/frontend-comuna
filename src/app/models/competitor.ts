import { Competition } from './competition';
import { Person } from './person';

export interface Competitor {
  _id?: string;
  competition: Competition | string;
  person: Person | string;
  fechaHoraInscripcion?: Date;
}
