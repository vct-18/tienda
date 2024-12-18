import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
declare const toastr: any;

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

  login(loginForm:any) {
    if (loginForm.valid) {
      console.log('Usuario autenticado:', this.user);

        let data ={
        email: this.user.email,
        password:this.user.password
}

this._adminService.login_admin(data).subscribe({

  next: (response) => {
    if(response.data == undefined){
      toastr.warning(response.message, 'error'); 

    }else{
      this.usuario=response.data;
      localStorage.setItem('token',response.token);
      localStorage.setItem('_id',response.data._id); 

      this._router.navigate(['/']);

    }
    console.log(response);  // Manejo de respuesta
    
  },
  error: (error) => {
    console.log(error);  // Manejo de error
    toastr.error('Error al autenticar el usuario', 'Error');
  }

});

} else {
toastr.error('Por favor, completa correctamente el formulario.', 'Error');
}
}
}
