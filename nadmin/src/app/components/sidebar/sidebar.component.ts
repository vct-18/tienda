import { Component,OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  public userName: string = 'Invitado'; // Cambiar dinámicamente según el usuario

  constructor(private _adminService: AdminService, private _router: Router) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.userName = this.capitalize(`${userData.nombres} ${userData.apellidos}`);
    }
  }

  capitalize(value: string): string {
    if (!value) return value;
    return value
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  cerrarSesion(): void {
    this._adminService.logout(); // Llama al servicio para cerrar sesión
    this._router.navigate(['/login']); // Redirige al login
  }
}
