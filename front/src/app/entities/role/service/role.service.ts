import {Injectable} from '@angular/core';
import {ApiHelperService} from "../../../core/auth/api-helper.service";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {HttpEntityResponse} from "../../../core/utils/http-entity-response.model";
import {IRole} from "../role.model";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private readonly endpoint: string = 'roles';

  constructor(
    private api: ApiHelperService,
  ) {
  }

  async delete(id: number): Promise<Observable<HttpResponse<{}>>> {
    return await this.api.delete({endpoint: `/${this.endpoint}/${id}`})
  }

  async getAll(): Promise<HttpEntityResponse> {
    return await this.api.get({endpoint: `/${this.endpoint}`})
  }

  async create(role: IRole): Promise<HttpEntityResponse> {
    return await this.api.post({endpoint: `/${this.endpoint}`, data: {...role}});
  }

  async update(userId: number, associationId: number, role: string): Promise<HttpEntityResponse> {
    return await this.api.put({endpoint: `/${this.endpoint}/${userId}/${associationId}`, data: {name: role}});
  }
}
