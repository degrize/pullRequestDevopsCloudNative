import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AlertService} from "./alert.service";

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit, OnDestroy{

  @Input()
  key: number = 0;

  @Input()
  msg: string | null | undefined = '';

  @Input()
  type: string | null | undefined = '';

  @Input()
  time: number = 6000;

  @Output()
  deleteItemEvent = new EventEmitter<number>();

  onDismiss = (key: number) => {
    this.deleteItemEvent.emit(key)
  };

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    setTimeout(()=> {
      this.alertService.close(this.key);
    }, this.time)
  }

  ngOnDestroy(): void {
    this.alertService.clear();
  }

}
