export interface Evento {
  _id: string | null;
  description: string;
  fechaHoraIni?: Date;
  fechaHoraFin?: Date;
  image: string;
}
