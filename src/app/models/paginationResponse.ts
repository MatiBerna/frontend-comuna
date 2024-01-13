import { CompetitionType } from './competition-type';
import { Evento } from './evento';
import { Person } from './person';

export interface PaginationResponse {
  docs: Person[] | CompetitionType[] | Evento[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
