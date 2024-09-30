import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CustomToolbarComponent} from "./shared/custom-toolbar/custom-toolbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo-app-konkret';
}
