import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {ButtonBackPageComponent} from "../../components/button-back-page/button-back-page.component";

@Component({
  selector: 'app-main',
  standalone: true,
    imports: [
        RouterOutlet,
        ButtonBackPageComponent
    ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
