import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAdminComponent } from 'src/app/components/admins/add-admin/add-admin.component';
import { ConfirmModalComponent } from 'src/app/components/shared/confirm-modal/confirm-modal.component';
import { Admin } from 'src/app/models/admin';
import { AdminsService } from 'src/app/services/admins/admins.service';
import { ToastService } from 'src/app/services/shared/toast/toast.service';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css'],
})
export class AdminListComponent implements OnInit {
  errorMessage: string = '';
  terminoBusqueda: string = '';
  adminList: Admin[] = [];
  voidAdmin: Admin = {
    _id: null,
  };

  constructor(
    private adminService: AdminsService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) {}

  getAdmins() {
    this.adminService.getAll().subscribe({
      next: (admins: Admin[]) => {
        this.adminList = admins;
      },
      error: (errorData) => {
        console.log(errorData);
        this.errorMessage = errorData;
      },
    });
  }

  openModal(admin: Admin) {
    const modalRef = this.modalService.open(AddAdminComponent);

    modalRef.componentInstance.admin = admin;

    modalRef.dismissed.subscribe((reason: string) => {
      if (reason === 'Registro') {
        this.toastService.show('Cambios registrados', {
          classname: 'bg-success text-light',
          delay: 5000,
        });
      }
      this.getAdmins();
    });
  }

  deleteAdmin(admin: Admin) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.message =
      '¿Está seguro que quiere eliminar el Administrador? Esta acción no se puede revertir';
    modalRef.dismissed.subscribe((reason: string) => {
      if (reason === 'aceptar') {
        console.log('borrando');
        this.adminService.delete(admin).subscribe({
          error: (error) => {
            console.log(error);
            this.toastService.show(error, {
              classname: 'bg-danger text-light',
              delay: 10000,
            });
          },
          complete: () => {
            console.log('Administrador Borrado');
            this.toastService.show('Administrador borrado', {
              classname: 'bg-success text-light',
              delay: 5000,
            });
            this.getAdmins();
          },
        });
      }
    });
  }

  ngOnInit(): void {
    this.getAdmins();
  }
}
