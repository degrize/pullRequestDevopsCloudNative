import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-password-modal',
  standalone: true,
  imports: [],
  templateUrl: './password-modal.component.html',
  styleUrl: './password-modal.component.css'
})
export class PasswordModalComponent implements OnInit{

  @Output() passwordEvent = new EventEmitter<string>();

  ngOnInit(): void {
    initFlowbite();
  }

  writePassword(value: string) {
    this.passwordEvent.emit(value);
  }

}
