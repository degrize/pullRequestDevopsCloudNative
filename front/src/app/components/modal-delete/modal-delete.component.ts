import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {initFlowbite} from "flowbite";
import {ModalDeleteService} from "./modal-delete.service";

@Component({
  selector: 'app-modal-delete',
  standalone: true,
  imports: [],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.css'
})
export class ModalDeleteComponent implements OnInit{

  @Output()
  deleteEvent = new EventEmitter<string>();

  DeleteItem() {
    this.deleteEvent.emit(this.modalDeleteService.getModalDeleteModel()?.id?.toString());
  }

  constructor(
    private modalDeleteService: ModalDeleteService
  ) {}

  ngOnInit(): void {
    initFlowbite();
  }

}



