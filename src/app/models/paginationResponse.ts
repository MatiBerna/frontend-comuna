import { Competition } from './competition';
import { CompetitionType } from './competition-type';
import { Competitor } from './competitor';
import { Evento } from './evento';
import { Person } from './person';

export interface PaginationResponse {
  docs: Person[] | CompetitionType[] | Evento[] | Competition[] | Competitor[];
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
