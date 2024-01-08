import { CompetitionType } from './competition-type';
import { Evento } from './evento';

export interface Competition {
  _id: string | null;
  evento?: Evento | string;
  competitionType?: CompetitionType | string;
  descripcion: string;
  fechaHoraIni?: Date;
  fechaHoraFinEstimada?: Date;
  premios?: string;
  costoInscripcion?: number;
}
