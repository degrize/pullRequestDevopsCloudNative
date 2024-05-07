import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        NgForOf
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  ngOnInit(): void {
    initFlowbite();
  }

}
