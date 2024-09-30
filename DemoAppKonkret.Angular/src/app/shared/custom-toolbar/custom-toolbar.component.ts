import { Component } from '@angular/core';
import {ToolbarModule} from "primeng/toolbar";
import {AvatarModule} from "primeng/avatar";
import {NgOptimizedImage} from "@angular/common";
import {Button, ButtonDirective} from "primeng/button";
import {SplitButtonModule} from "primeng/splitbutton";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-custom-toolbar',
  standalone: true,
  imports: [
    ToolbarModule,
    AvatarModule,
    NgOptimizedImage,
    ButtonDirective,
    Button,
    SplitButtonModule,
    InputTextModule
  ],
  templateUrl: './custom-toolbar.component.html',
  styleUrl: './custom-toolbar.component.scss'
})
export class CustomToolbarComponent {

}
