import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {

  @Input()
  key: number = 0;

  @Input()
  msg: string | null | undefined = '';

  @Input()
  type: string | null | undefined = '';
}
