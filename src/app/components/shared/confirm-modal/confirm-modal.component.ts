import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css'],
})
export class ConfirmModalComponent {
  @Input() message: string = '';
  constructor(private modalService: NgbModal) {}
  close(motivo: string) {
    this.modalService.dismissAll(motivo);
  }
}
