import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionType } from 'src/app/models/competition-type';
import { CompetitionTypesService } from 'src/app/services/competition-types/competition-types.service';

@Component({
  selector: 'app-add-competition-type',
  templateUrl: './add-competition-type.component.html',
  styleUrls: ['./add-competition-type.component.css'],
})
export class AddCompetitionTypeComponent implements OnInit {
  @Input() compeType!: CompetitionType;
  compeTypeError: string = '';
  submitted: boolean = false;
  compeTypeForm = this.formBuilder.group({
    _id: [''],
    description: ['', [Validators.required]],
    image: ['', [Validators.required]],
    rules: ['', [Validators.required]],
  });

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private compTypesService: CompetitionTypesService
  ) {}

  close(reason: string) {
    this.compeTypeForm.reset();
    this.modalService.dismissAll(reason);
  }

  addOrUpdate() {
    this.submitted = true;
    if (this.compeTypeForm.valid) {
      const compeTypeToSend: CompetitionType = this.compeTypeForm
        .value as CompetitionType;
      console.log(compeTypeToSend);
      this.compTypesService.addOrUpdate(compeTypeToSend).subscribe({
        error: (err) => {
          console.log(err);
          this.compeTypeError = err;
        },
        complete: () => {
          console.log('Cambios Registrados');
          this.close('Registro');
        },
      });
    } else {
      this.compeTypeForm.markAllAsTouched();
    }
  }

  get controls() {
    return this.compeTypeForm.controls;
  }

  get description() {
    return this.compeTypeForm.controls.description;
  }

  get image() {
    return this.compeTypeForm.controls.image;
  }

  get rules() {
    return this.compeTypeForm.controls.rules;
  }

  ngOnInit(): void {
    //this.compeTypeForm.setValue(this.compeType);
    this.compeTypeForm.controls._id.setValue(this.compeType._id);
    this.compeTypeForm.controls.image.setValue(this.compeType.image);
    this.compeTypeForm.controls.description.setValue(
      this.compeType.description
    );
    this.compeTypeForm.controls.rules.setValue(this.compeType.rules);
  }
}
