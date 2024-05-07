import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {ApiHelperService} from "../../../core/auth/api-helper.service";
import {HttpEntityResponse} from "../../../core/utils/http-entity-response.model";

@Injectable({
  providedIn: 'root'
})
export class AssociationService {

  private readonly endpoint: string = 'associations';

  constructor(
    private api: ApiHelperService,
  ) {
  }

  async create(name: string, usersId: number[]): Promise<Observable<HttpResponse<{}>>> {
    return await this.api.post({
      endpoint: `/${this.endpoint}`,
      data: {
        idUsers: usersId,
        name: name,
      },
    });
  }

  async update(associationId: number, usersId: number[], name: string) {
    return await this.api.put({
      endpoint: `/${this.endpoint}/${associationId}`,
      data: {
        idUsers: usersId,
        name: name,
      },
    });
  }

  async join(id: number, userId: number): Promise<Observable<HttpResponse<{}>>> {
    return await this.api.put({
      endpoint: `/${this.endpoint}/${id}/join`,
      data: {
        userId: userId
      },
    });
  }

  async leave(id: number, userId: number): Promise<Observable<HttpResponse<{}>>> {
    return await this.api.put({
      endpoint: `/${this.endpoint}/${id}/leave`,
      data: {
        userId: userId
      },
    });
  }

  async delete(id: number): Promise<Observable<HttpResponse<{}>>> {
    return await this.api.delete({endpoint: `/${this.endpoint}/${id}`})
  }

  async getAll(): Promise<HttpEntityResponse> {
    return await this.api.get({endpoint: `/${this.endpoint}`})
  }

  async getAllWithoutDTO(): Promise<HttpEntityResponse> {
    return await this.api.get({endpoint: `/${this.endpoint}/without-dto`})
  }

  async pushNotification(associationId: number, userId: number, message: string): Promise<HttpEntityResponse> {
    return await this.api.post({
      endpoint: `/${this.endpoint}/${associationId}/notification`,
      data: {
        userId: userId,
        message: message
      }
    });
  }
}
