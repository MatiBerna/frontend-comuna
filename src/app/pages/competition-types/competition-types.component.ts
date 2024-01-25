import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCompetitionTypeComponent } from 'src/app/components/competition-types/add-competition-type/add-competition-type.component';
import { ConfirmModalComponent } from 'src/app/components/shared/confirm-modal/confirm-modal.component';
import { CompetitionType } from 'src/app/models/competition-type';
import { PaginationResponse } from 'src/app/models/paginationResponse';
import { CompetitionTypesService } from 'src/app/services/competition-types/competition-types.service';
import { ToastService } from 'src/app/services/shared/toast/toast.service';

@Component({
  selector: 'app-competition-types',
  templateUrl: './competition-types.component.html',
  styleUrls: ['./competition-types.component.css'],
})
export class CompetitionTypesComponent implements OnInit, OnDestroy {
  page: number = 1;
  pageSize: number = 10;
  totalDocs!: number;
  pagingCounter!: number;
  compTypeList: CompetitionType[] = [];
  errorMessage: string = '';
  terminoBusqueda: string = '';
  voidCompeType: CompetitionType = {
    _id: null,
    description: '',
    rules: '',
    image: '',
  };

  constructor(
    private compTypeService: CompetitionTypesService,
    private modalService: NgbModal,
    public toastService: ToastService
  ) {}

  getCompetitionTypes(newPage: number) {
    let filtro: string | null = null;
    if (this.terminoBusqueda !== '') {
      filtro = this.terminoBusqueda;
    }
    this.compTypeService.getAll(filtro, newPage).subscribe({
      next: (pagResponse: PaginationResponse) => {
        this.totalDocs = pagResponse.totalDocs;
        this.page = pagResponse.page;
        this.pagingCounter = pagResponse.pagingCounter;
        this.compTypeList = pagResponse.docs as CompetitionType[];
      },
      error: (errorData) => {
        console.log(errorData);
        this.errorMessage = errorData;
      },
    });
  }

  deleteCompeType(compeType: CompetitionType) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.message =
      '¿Está seguro que quiere eliminar el tipo de competencia? Esta acción no se puede revertir';
    modalRef.dismissed.subscribe((reason: string) => {
      if (reason === 'aceptar') {
        console.log('borrando');
        this.compTypeService.delete(compeType).subscribe({
          error: (error) => {
            console.log(error);
            this.toastService.show(error, {
              classname: 'bg-danger text-light',
              delay: 10000,
            });
          },
          complete: () => {
            console.log('Tipo de Competencia Borrado');
            this.toastService.show('Tipo de competencia borrado', {
              classname: 'bg-success text-light',
              delay: 5000,
            });
            this.getCompetitionTypes(this.page);
          },
        });
      }
    });
  }

  openModal(compeType: CompetitionType) {
    const modalRef = this.modalService.open(AddCompetitionTypeComponent, {
      backdrop: true,
    });
    modalRef.componentInstance.compeType = compeType;

    modalRef.dismissed.subscribe((reason: string) => {
      if (reason === 'Registro') {
        this.toastService.show('Cambios registrados', {
          classname: 'bg-success text-light',
          delay: 5000,
        });
      }
      this.getCompetitionTypes(this.page);
    });
  }

  ngOnInit(): void {
    this.getCompetitionTypes(this.page);
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
