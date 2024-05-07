import {Component} from '@angular/core';

@Component({
  selector: 'app-button-back-page',
  standalone: true,
  imports: [],
  templateUrl: './button-back-page.component.html',
  styleUrl: './button-back-page.component.css'
})
export class ButtonBackPageComponent {

  backPage(): void {
    window.history.back();
  }
}
