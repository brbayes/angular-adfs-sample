import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Component({
    template: `<p>Please wait while we finish logging you in...</p>`
})
export class AuthCallbackComponent implements OnInit {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router) {}

    ngOnInit(): void {
        this.authenticationService.handleAuthRedirect().subscribe(() => {
            this.router.navigate(['']);
        });
    }
}
