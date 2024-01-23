import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-add-modal',
  templateUrl: './confirm-add-modal.component.html',
  styleUrls: ['./confirm-add-modal.component.css'],
})
export class ConfirmAddModalComponent {
  @Input() message: string = '';
  constructor(private modalService: NgbModal) {}
  close(motivo: string) {
    this.modalService.dismissAll(motivo);
  }
}
