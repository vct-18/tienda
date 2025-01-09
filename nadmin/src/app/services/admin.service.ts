import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';



@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public url; 

  constructor(
    private _http:HttpClient,
  ) { 
    
  this.url = GLOBAL.url;
}
login_admin(data:any):Observable<any>{
  let headers = new HttpHeaders().set('content-type','application/json');
  return this._http.post(this.url+'login_admin',data,{headers:headers});

}
getToken(){
  return localStorage.getItem('token');
} 
public isAuthenticated(allowRoles : string[]) :boolean{
const token = localStorage.getItem('token');


if(!token){
  return false;
}

try {
  const helper = new JwtHelperService();
var decodedToken = helper.decodeToken(token);

console.log(decodedToken);

if(!decodedToken){
  console.log('no es valido');
  localStorage.removeItem('token'); 
  return false;
}

} catch (error) {
  localStorage.removeItem('token'); 
  return false;
  
}

  return allowRoles.includes(decodedToken['role']);

}

  // Simulación: guarda el usuario en el localStorage (puedes usar tu propia lógica de sesión)
  guardarUsuario(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  obtenerUsuario(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}