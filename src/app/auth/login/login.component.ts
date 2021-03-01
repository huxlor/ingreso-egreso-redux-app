import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store'
import { AppState } from '../../app.reducer';

import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  loading: boolean = false;
  uiSubscription$: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription$ = this.store.select('ui').subscribe(ui => {
      this.loading = ui.isLoading;
      console.log('Cargando subs');
    });
  }

  ngOnDestroy() {
    this.uiSubscription$.unsubscribe();
  }

  loginUsuario() {
    if(this.loginForm.invalid) return; 

    this.store.dispatch(ui.isLoading());

    // Swal.fire({
    //   title: 'Cargando...',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const {email, password} = this.loginForm.value;
    this.authService.loginUsuario(email, password)
      .then(credenciales => {
        // Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
        console.log(credenciales);
      })
      .catch(err => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        })
      });
  }

}
