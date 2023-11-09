import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCompetitionTypeComponent } from 'src/app/components/competition-types/add-competition-type/add-competition-type.component';
import { CompetitionType } from 'src/app/models/competition-type';
import { CompetitionTypesService } from 'src/app/services/competition-types/competition-types.service';

@Component({
  selector: 'app-competition-types',
  templateUrl: './competition-types.component.html',
  styleUrls: ['./competition-types.component.css'],
})
export class CompetitionTypesComponent implements OnInit {
  compTypeList: CompetitionType[] = [];
  errorMessage: string = '';
  terminoBusqueda: string = '';
  voidCompeType: CompetitionType = {
    _id: null,
    description: '',
    rules: '',
  };

  constructor(
    private compTypeService: CompetitionTypesService,
    private modalService: NgbModal
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
    if (window.confirm('¿estás seguro que quieres borrar el socio?')) {
      console.log('borrando');
      this.compTypeService.delete(compeType).subscribe({
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('Socio Borrado');
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

    modalRef.dismissed.subscribe(() => {
      this.getCompetitionTypes();
    });
  }

  ngOnInit(): void {
    this.getCompetitionTypes();
    console.log(this.compTypeList);
  }
}
