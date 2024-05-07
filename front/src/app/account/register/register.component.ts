import {Component} from '@angular/core';
import {UsersUpdateComponent} from "../../entities/user/users-update/users-update.component";

@Component({
  selector: 'app-register',
  standalone: true,
    imports: [
        UsersUpdateComponent
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

}
