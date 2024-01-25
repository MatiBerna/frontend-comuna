import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { PersonsListComponent } from './pages/persons-list/persons-list.component';
import { loginGuard } from './guards/login.guard';
import { adminGuard } from './guards/admin.guard';
import { CompetitionTypesComponent } from './pages/competition-types/competition-types.component';
import { EventosComponent } from './pages/eventos/eventos.component';
import { CompetitionsListComponent } from './pages/competitions-list/competitions-list.component';
import { AdminListComponent } from './pages/admin/admin-list/admin-list.component';
import { RegisterComponent } from './auth/register/register.component';
import { CompetitorsComponent } from './pages/competitors/competitors.component';
import { EventoDescriptionComponent } from './pages/common-user/evento-description/evento-description.component';
import { RegistrationsListComponent } from './pages/common-user/registrations-list/registrations-list.component';
import { personGuard } from './guards/person.guard';
import { EventosListComponent } from './pages/common-user/eventos-list/eventos-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
  { path: 'home', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'persons',
    component: PersonsListComponent,
    canActivate: [loginGuard, adminGuard],
  },
  {
    path: 'competition-types',
    component: CompetitionTypesComponent,
    canActivate: [loginGuard, adminGuard],
  },
  {
    path: 'eventos-admin',
    component: EventosComponent,
    canActivate: [loginGuard, adminGuard],
  },
  {
    path: 'competitions',
    component: CompetitionsListComponent,
    canActivate: [loginGuard, adminGuard],
  },
  {
    path: 'admins',
    component: AdminListComponent,
    canActivate: [loginGuard, adminGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'competitors/:id',
    component: CompetitorsComponent,
    canActivate: [loginGuard, adminGuard],
  },
  {
    path: 'event/:id',
    component: EventoDescriptionComponent,
  },
  {
    path: 'registrations',
    component: RegistrationsListComponent,
    canActivate: [loginGuard, personGuard],
  },
  {
    path: 'eventos',
    component: EventosListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
