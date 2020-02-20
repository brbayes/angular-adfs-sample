import { Component, OnInit } from '@angular/core';
import { Profile } from 'oidc-client';

import { AuthenticationService } from './authentication.service';

@Component({
  template: `
    <div>User: {{ userProfile | json }}</div>

    <div>
        <button (click)="login()">Login</button>
        <button (click)="logout()">Logout</button>
    </div>
  `
})
export class HomeComponent implements OnInit {
  userProfile: Profile;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.getUserProfile().subscribe(profile => this.userProfile = profile);
  }

  login(): void {
    this.authenticationService.login();
  }

  logout(): void {
    this.authenticationService.logout();
  }
}
