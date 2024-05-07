import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {initFlowbite} from "flowbite";
import {NavComponent} from "./layouts/nav/nav.component";
import {MainComponent} from "./layouts/main/main.component";
import {FooterComponent} from "./layouts/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavComponent, MainComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'fr-administration-front';

  ngOnInit() {
    initFlowbite();
  }
}
