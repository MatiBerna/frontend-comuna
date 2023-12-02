import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  NgbDateStruct,
  NgbModal,
  NgbTimeStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { Competition } from 'src/app/models/competition';
import { CompetitionType } from 'src/app/models/competition-type';
import { Evento } from 'src/app/models/evento';
import { CompetitionTypesService } from 'src/app/services/competition-types/competition-types.service';
import { CompetitionsService } from 'src/app/services/competitions/competitions.service';
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
  today: Date = new Date();
  eventos: Evento[] = [];
  compeTypes: CompetitionType[] = [];
  minDate!: NgbDateStruct | null;
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
    private toastService: ToastService
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
        _idEvento: this._idEvento.value!,
        _idCompetitionType: this._idcompetitionType.value!,
      };

      console.log(competitionToSend);

      this.competitionService.addOrUpdate(competitionToSend).subscribe({
        error: (err) => {
          console.log(err);
          this.competitionError = err;
        },
        complete: () => {
          console.log('Cambios registrados');
          this.close();
        },
      });
    } else {
      this.competitionForm.markAllAsTouched();
    }
  }

  close() {
    this.modalService.dismissAll();
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

    this.eventoService.getAll('?prox=true').subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
      },
      error: (errorData) => {
        console.log(errorData);
        this.toastService.show(errorData, {
          classname: 'bg-danger text-light',
          delay: 10000,
        });
        this.close();
      },
    });

    this.competitionTypeService.getAll().subscribe({
      next: (compeTypes: CompetitionType[]) => {
        this.compeTypes = compeTypes;
      },
      error: (errorData) => {
        console.log(errorData);
        this.toastService.show(errorData, {
          classname: 'bg-danger text-light',
          delay: 10000,
        });
        this.close();
      },
    });

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

    this.competitionForm.controls.description.setValue(
      this.competition.descripcion
    );
    if (this.competition.evento) {
      this.competitionForm.controls._idEvento.setValue(
        this.competition.evento!._id
      );
      this.competitionForm.controls._idCompetitionType.setValue(
        this.competition.competitionType!._id
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
  }

  convertDateToNgbDate(fechaHoraP: string): NgbDateStruct {
    const fechaHora: Date = new Date(fechaHoraP);
    console.log(fechaHora);
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
