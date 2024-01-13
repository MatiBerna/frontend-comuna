import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  NgbDateStruct,
  NgbModal,
  NgbTimeStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Competition } from 'src/app/models/competition';
import { CompetitionType } from 'src/app/models/competition-type';
import { Evento } from 'src/app/models/evento';
import { PaginationResponse } from 'src/app/models/paginationResponse';
import { CompetitionTypesService } from 'src/app/services/competition-types/competition-types.service';
import { CompetitionsService } from 'src/app/services/competitions/competitions.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { ToastService } from 'src/app/services/shared/toast/toast.service';

@Component({
  selector: 'app-add-competition',
  templateUrl: './add-competition.component.html',
  styleUrls: ['./add-competition.component.css'],
})
export class AddCompetitionComponent implements OnInit {
  @Input() competition!: Competition;
  competitionError: string = '';
  private errorSub!: Subscription;
  today: Date = new Date();
  eventos: Evento[] = [];
  selectedEventId: string = '';
  compeTypes: CompetitionType[] = [];
  minDate!: NgbDateStruct | null;
  maxDate!: NgbDateStruct | null;
  minHour!: NgbTimeStruct | null;

  competitionForm = this.formBuilder.group({
    _idCompetitionType: ['', [Validators.required]],
    _idEvento: ['', [Validators.required]],
    description: ['', [Validators.required]],
    fechaIni: [this.minDate, [Validators.required]],
    horaIni: [this.minHour, [Validators.required]],
    fechaFinEstimada: [this.minDate, [Validators.required]],
    horaFinEstimada: [this.minHour, [Validators.required]],
    premios: ['', [Validators.required]],
    costoInscripcion: [
      '',
      [
        Validators.required,
        Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
        Validators.min(0),
      ],
    ],
  });

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private eventoService: EventosService,
    private competitionTypeService: CompetitionTypesService,
    private competitionService: CompetitionsService,
    private toastService: ToastService,
    private errorService: ErrorService
  ) {}

  addOrUpdate() {
    if (this.competitionForm.valid) {
      const fechaHoraIni = new Date(
        this.fechaIni.value!.year,
        this.fechaIni.value!.month - 1,
        this.fechaIni.value!.day,
        this.horaIni.value!.hour,
        this.horaIni.value!.minute
      );
      const fechaHoraFinEstimada = new Date(
        this.fechaFinEstimada.value!.year,
        this.fechaFinEstimada.value!.month - 1,
        this.fechaFinEstimada.value!.day,
        this.horaFinEstimada.value!.hour,
        this.horaFinEstimada.value!.minute
      );

      let costoInsc = this.costoInscripcion.value!;
      const ncostoInsc = Number(costoInsc.replace(',', '.'));

      const competitionToSend: Competition = {
        _id: this.competition._id,
        descripcion: this.description.value!,
        fechaHoraIni: fechaHoraIni,
        fechaHoraFinEstimada: fechaHoraFinEstimada,
        premios: this.premios.value!,
        costoInscripcion: ncostoInsc,
        evento: this._idEvento.value!,
        competitionType: this._idcompetitionType.value!,
      };

      this.competitionService.addOrUpdate(competitionToSend).subscribe({
        error: (err) => {
          console.log(err);
          this.competitionError = err;
        },
        complete: () => {
          console.log('Cambios registrados');
          this.close('Registro');
        },
      });
    } else {
      this.competitionForm.markAllAsTouched();
    }
  }

  close(reason: string) {
    this.modalService.dismissAll(reason);
  }

  setLimitesFechas(id: string | null) {
    const evento = this.eventos.find((event) => event._id === id);

    if (evento) {
      const fechaHoraIni = new Date(evento.fechaHoraIni!);
      this.minDate = {
        year: fechaHoraIni!.getFullYear(),
        month: fechaHoraIni!.getMonth() + 1,
        day: fechaHoraIni!.getDate(),
      };
      const fechaHoraFin = new Date(evento.fechaHoraFin!);
      this.maxDate = {
        year: fechaHoraFin!.getFullYear(),
        month: fechaHoraFin!.getMonth() + 1,
        day: fechaHoraFin!.getDate(),
      };
    }
  }

  //#region geters
  getFecha(fechaHora: Date | undefined) {
    const fecha = new Date(fechaHora!).toLocaleDateString('es-AR');
    return fecha;
  }

  get description() {
    return this.competitionForm.controls.description;
  }

  get _idEvento() {
    return this.competitionForm.controls._idEvento;
  }

  get _idcompetitionType() {
    return this.competitionForm.controls._idCompetitionType;
  }

  get fechaIni() {
    return this.competitionForm.controls.fechaIni;
  }

  get horaIni() {
    return this.competitionForm.controls.horaIni;
  }

  get fechaFinEstimada() {
    return this.competitionForm.controls.fechaFinEstimada;
  }

  get horaFinEstimada() {
    return this.competitionForm.controls.horaFinEstimada;
  }

  get premios() {
    return this.competitionForm.controls.premios;
  }

  get costoInscripcion() {
    return this.competitionForm.controls.costoInscripcion;
  }
  //#endregion

  ngOnInit(): void {
    this.minDate = {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate(),
    };
    this.minHour = {
      hour: this.today.getHours(),
      minute: this.today.getMinutes(),
      second: this.today.getSeconds(),
    };

    //#region services calls

    this.eventoService.getAll(null, null, 'true').subscribe({
      next: (pagResponse: PaginationResponse) => {
        this.eventos = pagResponse.docs as Evento[];
        if (this.competition.evento) {
          this.setLimitesFechas((this.competition.evento as Evento)._id);
        }
      },
      error: (errorData) => {
        console.log(errorData);
        this.toastService.show(errorData, {
          classname: 'bg-danger text-light',
          delay: 10000,
        });
        this.close('');
      },
    });

    this.competitionTypeService.getAll(null, null).subscribe({
      next: (pagResponse: PaginationResponse) => {
        this.compeTypes = pagResponse.docs as CompetitionType[];
      },
      error: (errorData) => {
        console.log(errorData);
        this.toastService.show(errorData, {
          classname: 'bg-danger text-light',
          delay: 10000,
        });
        this.close('');
      },
    });
    //#endregion

    //#region  convert Dates
    let fechaIni: NgbDateStruct | null = null;
    let horaIni: NgbTimeStruct | null = null;
    if (this.competition.fechaHoraIni) {
      fechaIni = this.convertDateToNgbDate(
        this.competition.fechaHoraIni.toString()
      );
      horaIni = this.convertDateToNgbTime(
        this.competition.fechaHoraIni.toString()
      );
    }
    let fechaFin: NgbDateStruct | null = null;
    let horaFin: NgbTimeStruct | null = null;
    if (this.competition.fechaHoraFinEstimada) {
      fechaFin = this.convertDateToNgbDate(
        this.competition.fechaHoraFinEstimada.toString()
      );
      horaFin = this.convertDateToNgbTime(
        this.competition.fechaHoraFinEstimada.toString()
      );
    }
    //#endregion

    //#region setValues
    this.competitionForm.controls.description.setValue(
      this.competition.descripcion
    );
    if (this.competition.evento) {
      this.competitionForm.controls._idEvento.setValue(
        (this.competition.evento as Evento)._id
      );

      this.competitionForm.controls._idCompetitionType.setValue(
        (this.competition.competitionType as CompetitionType)._id
      );
    }
    this.competitionForm.controls.premios.setValue(this.competition.premios!);
    if (this.competition.costoInscripcion) {
      this.competitionForm.controls.costoInscripcion.setValue(
        this.competition.costoInscripcion!.toString()
      );
    }
    this.competitionForm.controls.fechaIni.setValue(fechaIni);
    this.competitionForm.controls.horaIni.setValue(horaIni);
    this.competitionForm.controls.fechaFinEstimada.setValue(fechaFin);
    this.competitionForm.controls.horaFinEstimada.setValue(horaFin);
    //#endregion

    this.errorSub = this.errorService.errors.subscribe((errors) => {
      for (const error of errors) {
        switch (error.path) {
          case 'description':
            this.description.setErrors({ serverError: error.msg });
            break;
          case 'evento':
            this._idEvento.setErrors({ serverError: error.msg });
            break;
          case 'competitionType':
            this._idcompetitionType.setErrors({ serverError: error.msg });
            break;
          case 'premios':
            this.premios.setErrors({ serverError: error.msg });
            break;
          case 'fechaHoraIni':
            this.fechaIni.setErrors({ serverError: error.msg });
            break;
          case 'fechaHoraFinEstimada':
            this.fechaFinEstimada.setErrors({ serverError: error.msg });
            break;
          case 'costoInscripcion':
            this.costoInscripcion.setErrors({ serverError: error.msg });
            break;
        }
      }
    });
  }

  convertDateToNgbDate(fechaHoraP: string): NgbDateStruct {
    const fechaHora: Date = new Date(fechaHoraP);
    const fechaNgb: NgbDateStruct = {
      year: fechaHora.getFullYear(),
      month: fechaHora.getMonth() + 1,
      day: fechaHora.getDate(),
    };
    return fechaNgb;
  }

  convertDateToNgbTime(fechaHoraP: string): NgbTimeStruct {
    const fechaHora: Date = new Date(fechaHoraP);
    const horaNgb: NgbTimeStruct = {
      hour: fechaHora.getHours(),
      minute: fechaHora.getMinutes(),
      second: fechaHora.getSeconds(),
    };
    return horaNgb;
  }
}
