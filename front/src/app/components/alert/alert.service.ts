import {Injectable} from '@angular/core';
import {IAlert} from "./alert.model";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alerts: IAlert[] = [];

  constructor() { }

  clear(): void {
    this.alerts = [];
  }

  get(): IAlert[] {
    return this.alerts;
  }

  addAlert(alert: IAlert): void {
    if (alert) {
      if (this.alerts.length > 0) {
        if (this.alerts[this.alerts.length -1].msg !== alert.msg) {
          this.alerts.push(alert);
        }
      } else {
        this.alerts.push(alert);
      }

    }
  }

  close(key: number) {
    this.alerts.splice(this.alerts.length - key - 1, 1); // parce que nous avons renversé le tableau au debut
  }
}

