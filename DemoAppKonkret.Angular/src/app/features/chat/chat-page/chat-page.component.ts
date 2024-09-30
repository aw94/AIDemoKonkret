import { Component } from '@angular/core';
import {ChatWindowComponent} from "../chat-window/chat-window.component";

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    ChatWindowComponent
  ],
  providers: [],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {

}
