import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  public user: any = { };
  public usuario: any = { };
  public token : any = '';

  constructor(
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
   console.log(this.token);
   if(this.token){
    this._router.navigate(['/'])
   }else{
    
   }
   
    
  }
  login(loginForm: any): void {


    
    if (loginForm.valid) {
      const data = {
        email: this.user.email,
        password: this.user.password
      };
      

      this._adminService.login_admin(data).subscribe({
        next: (response) => {
          if (response.data == undefined) {
            this.user.loginError = response.message; // Error del servidor
          } else {
            this.usuario=response.data;
            localStorage.setItem('token', response.token);
            localStorage.setItem('_id', response.data._id);
            localStorage.setItem('user', JSON.stringify(response.data)); // Guarda todos los datos del usuario
            this._router.navigate(['/']);
          }
          console.log(response);  // Manejo de respuesta
        },
        error: () => {
          this.user.loginError = 'Error al autenticar. Intenta nuevamente.'; // Error general
        }
      });
    } else {
      this.user.loginError = 'Por favor completa correctamente todos los campos.';
    }
  }
}

