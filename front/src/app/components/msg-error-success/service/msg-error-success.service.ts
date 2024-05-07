import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MsgErrorSuccessService {
  msg: string | null = null;
  isError: boolean | null = null;
  constructor(
  ) {}

}
