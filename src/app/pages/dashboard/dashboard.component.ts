import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { Person } from 'src/app/models/person';
import { LoginService } from 'src/app/services/auth/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
