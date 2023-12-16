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

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
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
    path: 'eventos',
    component: EventosComponent,
  },
  {
    path: 'competitions',
    component: CompetitionsListComponent,
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
