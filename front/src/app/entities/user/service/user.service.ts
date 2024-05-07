import {Injectable} from '@angular/core';
import {USERNAME_KEY} from "../../../core/constants/Constants";
import {ApiHelperService} from "../../../core/auth/api-helper.service";
import {IUser} from "../user.model";
import {HttpEntityResponse} from "../../../core/utils/http-entity-response.model";
import {TokenStorageService} from "../../../core/auth/token-storage.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly endpoint: string = 'users';

  constructor(
    private api: ApiHelperService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
  ) {
  }

  async getCurrentUser(): Promise<IUser> {
    let user: any;
    const userId = localStorage.getItem(USERNAME_KEY);
    user = await this.api.get({endpoint: `/${this.endpoint}/email/${userId}`})
      .then(res => {
        user = res.data
        return user;
      });
    return user;
  }

  async create(user: IUser): Promise<HttpEntityResponse> {
    return await this.api.post({endpoint: `/${this.endpoint}`, data: {...user}});
  }

  async delete(id: number): Promise<void> {
    this.api.delete({endpoint: `/${this.endpoint}/${id}/relationship`})
      .then(() => {
        setTimeout(() => {
          this.api.delete({endpoint: `/${this.endpoint}/${id}`})
            .then(() => {
              this.tokenStorageService.clear();
              this.router.navigateByUrl('/login');
            })
        }, 1000);

      });

  }

  async getAll(): Promise<HttpEntityResponse> {
    return await this.api.get({endpoint: `/${this.endpoint}`})
  }

}
