import {Component, OnInit} from '@angular/core';
import {IUser} from "../user.model";
import {ActivatedRoute, ParamMap, Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {lastValueFrom, Observable} from "rxjs";
import {NgForOf, NgIf, TitleCasePipe, UpperCasePipe} from "@angular/common";
import {
  UsersDetailAccordionComponent
} from "../../../components/users-detail-accordion/users-detail-accordion.component";

@Component({
  selector: 'app-users-detail',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    TitleCasePipe,
    UpperCasePipe,
    RouterLink,
    UsersDetailAccordionComponent
  ],
  templateUrl: './users-detail.component.html',
  styleUrl: './users-detail.component.css'
})
export class UsersDetailComponent implements OnInit {
  id: number = -1;
  user!: IUser;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient,) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = Number(paramMap.get("id"));
      if (!this.id || this.id < 0) {
        this.redirectToUsers();
      }
    });

    const request: Observable<any> = this.http.get(`http://localhost:3000/users/${this.id}`, {observe: 'response'});
    lastValueFrom(request)
      .then(response => this.user = response.body.data)
      .catch(error => this.redirectToUsers());
  }

  redirectToUsers(): void {
    this.router.navigateByUrl("/users");
  }
}
