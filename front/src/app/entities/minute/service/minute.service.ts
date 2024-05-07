import {Injectable} from '@angular/core';
import {ApiHelperService} from "../../../core/auth/api-helper.service";
import {HttpEntityResponse} from "../../../core/utils/http-entity-response.model";

@Injectable({
  providedIn: 'root'
})
export class MinuteService {

  private readonly endpoint: string = 'minutes';

  constructor(
    private api: ApiHelperService,
  ) {
  }

  async create(content: string, date: string, associationId: number, votersId: number[]): Promise<HttpEntityResponse> {
    return await this.api.post({
      endpoint: `/${this.endpoint}`, data: {
        content: content,
        date: date,
        idAssociation: associationId,
        idVoters: votersId,
      }
    });
  }
}
