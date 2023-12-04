import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCompetitionTypeComponent } from 'src/app/components/competition-types/add-competition-type/add-competition-type.component';
import { CompetitionType } from 'src/app/models/competition-type';
import { CompetitionTypesService } from 'src/app/services/competition-types/competition-types.service';
import { ToastService } from 'src/app/services/shared/toast/toast.service';

@Component({
  selector: 'app-competition-types',
  templateUrl: './competition-types.component.html',
  styleUrls: ['./competition-types.component.css'],
})
export class CompetitionTypesComponent implements OnInit, OnDestroy {
  compTypeList: CompetitionType[] = [];
  errorMessage: string = '';
  terminoBusqueda: string = '';
  addedMessage: string = '';
  voidCompeType: CompetitionType = {
    _id: null,
    description: '',
    rules: '',
  };

  constructor(
    private compTypeService: CompetitionTypesService,
    private modalService: NgbModal,
    public toastService: ToastService
  ) {}

  getCompetitionTypes() {
    this.compTypeService.getAll().subscribe({
      next: (compTypes: CompetitionType[]) => {
        this.compTypeList = compTypes;
      },
      error: (errorData) => {
        console.log(errorData);
        this.errorMessage = errorData;
      },
    });
  }

  deleteCompeType(compeType: CompetitionType) {
    if (
      window.confirm('¿estás seguro que quieres borrar el Tipo de Competencia?')
    ) {
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
          this.getCompetitionTypes();
        },
      });
    }
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
      this.getCompetitionTypes();
    });
  }

  ngOnInit(): void {
    this.getCompetitionTypes();
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
