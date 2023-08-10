import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-admin-loyout',
  templateUrl: './admin-loyout.component.html',
  styleUrls: ['./admin-loyout.component.scss']
})
export class AdminLoyoutComponent implements OnInit {
  constructor(private router: Router,
              public auth: AuthService
    ) { }

  ngOnInit(): void {

  }
  logout(event: Event) {
    event.preventDefault()
    this.auth.logout()
    this.router.navigate(['/admin', 'login'])
  }
}
