import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionType } from 'src/app/models/competition-type';

@Component({
  selector: 'app-competition-type-details',
  templateUrl: './competition-type-details.component.html',
  styleUrls: ['./competition-type-details.component.css'],
})
export class CompetitionTypeDetailsComponent {
  @Input() compType!: CompetitionType;

  constructor(private modalService: NgbModal) {}

  close() {
    this.modalService.dismissAll();
  }
}
