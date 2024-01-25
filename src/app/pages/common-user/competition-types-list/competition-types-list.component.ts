import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionTypeDetailsComponent } from 'src/app/components/competition-types/competition-type-details/competition-type-details.component';
import { CompetitionType } from 'src/app/models/competition-type';
import { PaginationResponse } from 'src/app/models/paginationResponse';
import { CompetitionTypesService } from 'src/app/services/competition-types/competition-types.service';

@Component({
  selector: 'app-competition-types-list',
  templateUrl: './competition-types-list.component.html',
  styleUrls: ['./competition-types-list.component.css'],
})
export class CompetitionTypesListComponent implements OnInit {
  page: number = 1;
  pageSize: number = 10;
  totalDocs!: number;
  pagingCounter!: number;
  compTypeList: CompetitionType[] = [];
  errorMessage: string = '';
  terminoBusqueda: string = '';

  constructor(
    private compTypeService: CompetitionTypesService,
    private modalService: NgbModal
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

  openDetails(compType: CompetitionType) {
    const modalRef = this.modalService.open(CompetitionTypeDetailsComponent);
    modalRef.componentInstance.compType = compType;
  }

  ngOnInit(): void {
    this.getCompetitionTypes(this.page);
  }
}
