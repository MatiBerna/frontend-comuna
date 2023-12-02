import { CompetitionType } from './competition-type';
import { Evento } from './evento';

export interface Competition {
  _id: string | null;
  evento?: Evento;
  competitionType?: CompetitionType;
  descripcion: string;
  fechaHoraIni?: Date;
  fechaHoraFinEstimada?: Date;
  premios?: string;
  costoInscripcion?: number;
  _idEvento?: string;
  _idCompetitionType?: string;
}
