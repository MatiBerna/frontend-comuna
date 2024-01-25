import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { NavComponent } from './shared/nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { PersonsListComponent } from './pages/persons-list/persons-list.component';
import { AddPersonComponent } from './components/persons/add-person/add-person.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFilterPipe } from './pipes/custom-filter-pipe.pipe';
import { CompetitionTypesComponent } from './pages/competition-types/competition-types.component';
import { AddCompetitionTypeComponent } from './components/competition-types/add-competition-type/add-competition-type.component';
import { AddAdminComponent } from './components/admins/add-admin/add-admin.component';
import { EventosComponent } from './pages/eventos/eventos.component';
import { AddEventoComponent } from './components/eventos/add-evento/add-evento.component';
import { ToastsComponent } from './shared/toasts/toasts.component';
import { CompetitionsListComponent } from './pages/competitions-list/competitions-list.component';
import { AddCompetitionComponent } from './components/competitions/add-competition/add-competition.component';
import { CompetitionDetailComponent } from './components/competitions/competition-detail/competition-detail.component';
import { AdminListComponent } from './pages/admin/admin-list/admin-list.component';
import { RegisterComponent } from './auth/register/register.component';
import { ConfirmModalComponent } from './components/shared/confirm-modal/confirm-modal.component';
import { CompetitorsComponent } from './pages/competitors/competitors.component';
import { AddCompetitorComponent } from './components/competitors/add-competitor/add-competitor.component';
import { EventoDescriptionComponent } from './pages/common-user/evento-description/evento-description.component';
import { ConfirmAddModalComponent } from './components/shared/confirm-add-modal/confirm-add-modal.component';
import { RegistrationsListComponent } from './pages/common-user/registrations-list/registrations-list.component';
import { EventosListComponent } from './pages/common-user/eventos-list/eventos-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    LoginComponent,
    NavComponent,
    PersonsListComponent,
    AddPersonComponent,
    CustomFilterPipe,
    CompetitionTypesComponent,
    AddCompetitionTypeComponent,
    AddAdminComponent,
    EventosComponent,
    AddEventoComponent,
    ToastsComponent,
    CompetitionsListComponent,
    AddCompetitionComponent,
    CompetitionDetailComponent,
    AdminListComponent,
    RegisterComponent,
    ConfirmModalComponent,
    CompetitorsComponent,
    AddCompetitorComponent,
    EventoDescriptionComponent,
    ConfirmAddModalComponent,
    RegistrationsListComponent,
    EventosListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgbDatepickerModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
