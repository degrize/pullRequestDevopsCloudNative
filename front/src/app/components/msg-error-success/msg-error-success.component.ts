import {Component, OnDestroy} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {EventManager, EventWithContent} from "../../core/utils/event-manager.service";
import {Subscription} from "rxjs";
import {AlertError} from "../../core/utils/alert-error.model";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {IAlert} from "../alert/alert.model";
import {AlertComponent} from "../alert/alert.component";
import {AlertService} from "../alert/alert.service";

@Component({
  selector: 'app-msg-success-error',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AlertComponent
  ],
  templateUrl: './msg-error-success.component.html',
  styleUrl: './msg-error-success.component.css'
})
export class MsgErrorSuccessComponent implements OnDestroy {
  alerts: IAlert[] = [];
  errorListener: Subscription;
  httpErrorListener: Subscription;

  constructor(private eventManager: EventManager,
              private alertService: AlertService) {
    this.errorListener = eventManager.subscribe('frAdministrationFront.error', (response: EventWithContent<unknown> | string) => {
      const errorResponse = (response as EventWithContent<AlertError>).content;
      console.error(errorResponse.message, errorResponse.key);
      alert(errorResponse.message)
      // console.log(errorResponse.message, errorResponse.key, errorResponse.params);
    });

    this.httpErrorListener = eventManager.subscribe(
      'frAdministrationFront.httpError',
      (response: EventWithContent<unknown> | string) => {
        const httpErrorResponse = (response as EventWithContent<HttpErrorResponse>).content;
        switch (httpErrorResponse.status) {
          // connection refused, server not reachable
          case 0:
            console.error('Server not reachable ' + ' error.server.not.reachable');
            this.addAlert(true, 'Server not reachable')
            break;

          case 404:
            if (httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
              console.error(
                httpErrorResponse.error.detail ?? httpErrorResponse.error.message,
                httpErrorResponse.error.message,
                httpErrorResponse.error.params
              );
              this.addAlert(true, httpErrorResponse.error.message)
            } else {
              this.addAlert(true, httpErrorResponse.error)
              console.error(httpErrorResponse.error);
            }
            break;
          case 500:
            this.addAlert(true, "Erreur du server")
            break;

          default:
            if (httpErrorResponse.error !== '' && httpErrorResponse?.error?.message) {
              console.error(
                httpErrorResponse.error.detail ?? httpErrorResponse.error.message,
                httpErrorResponse.error.message,
                httpErrorResponse.error.params
              );
              this.addAlert(true, httpErrorResponse.error.message)
            } else {
              this.addAlert(true, httpErrorResponse.error)
              console.error(httpErrorResponse.error, httpErrorResponse.error);
            }
        }
      }
    );

    this.httpErrorListener = eventManager.subscribe(
      'frAdministrationFront.httpSuccess',
      (response: EventWithContent<unknown> | string) => {
        const httpResponse = (response as EventWithContent<HttpResponse<any>>).content;
        if (httpResponse?.body?.messageFromServer) {
          switch (httpResponse.status) {
            // connection refused, server not reachable
            case 200:
              this.addAlert(false, httpResponse.body.messageFromServer)
              console.log(httpResponse);
              break;

            case 201:
              this.addAlert(false, httpResponse.body.messageFromServer)
              console.log(httpResponse);
              break;

            default:
              if (httpResponse.type) {
                this.addAlert(false, httpResponse.statusText)
                console.log(httpResponse);
              }

          }
        }
      }
    );
  }

  ngOnInit(): void {
    this.alerts = this.alertService.get();
  }

  addAlert(isError: boolean, msg: string): void {

    this.alertService.addAlert(
      {
        type: isError ? 'danger' : 'success',
        msg: msg,
        time: 10000
      }
    )
    this.alerts = this.alertService.get();
  }

  deleteAlert(key: number) {
    // On supprime alert en question
    this.alertService.close(key);
    this.alerts = this.alertService.get();
  }

  ngOnDestroy(): void {
    this.alerts = [];
    this.eventManager.destroy(this.errorListener);
    this.eventManager.destroy(this.httpErrorListener);
  }
}
