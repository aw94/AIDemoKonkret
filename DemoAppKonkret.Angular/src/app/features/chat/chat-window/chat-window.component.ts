import {Component, OnInit, signal} from '@angular/core';
import {ChatService} from "../chat.service";
import {NbChatModule} from "@nebular/theme";
import {DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {SkeletonModule} from "primeng/skeleton";
import {CardModule} from "primeng/card";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {ButtonDirective} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {Message} from "../contracts/models/message";
import {interval, Subscription} from "rxjs";
import {ChatResponse, CitationInformationResponse} from "../contracts/responses/chatResponse";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [NbChatModule, NgForOf, SkeletonModule, NgIf, CardModule, ScrollPanelModule, ButtonDirective, FormsModule, InputTextModule, DatePipe, NgClass, NgStyle, TooltipModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent implements OnInit {
  awaitingReply: boolean = false;
  awaitingReplyText = signal('agent is working.');
  awaitingReplySubscription: Subscription = new Subscription();
  messages: Message[] = [
    {
      date: new Date(),
      text: 'Hello! How can I help you today?',
      reply: false,
      user: {
        name: 'agent',
        avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png'
      }
    }
  ];
  value: string = '';

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
  }

  sendMessage(message: string) {
    this.messages.push(this.createMessage(message, 'user', 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/nerd-face.png'));
    this.awaitingReply = true;
    this.awaitingReplySubscription = interval(200).subscribe(() => {
      this.awaitingReplyText.update(fn => fn.endsWith('...') ? fn.slice(0, -3) : fn.concat('.'));
    });
    this.chatService.sendMessage(message).subscribe((response) => {
      this.handleSuccess(response);
    }, (error) => {
      this.handleError(error);
    });
    this.value = '';
  }

  private handleSuccess(response: ChatResponse): void {
    this.messages.push(this.createMessage(response.outputText, 'agent', 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png', response.citations));
    this.awaitingReply = false;
    this.awaitingReplySubscription.unsubscribe();
  }

  private handleError(error: any): void {
    this.awaitingReplySubscription.unsubscribe();
    this.awaitingReplyText.set('something went wrong, please reload.');
    console.error(error);
  }

  private createMessage(message: string, user: string, avatar: string, citations?: CitationInformationResponse[]): Message {
    return {
      text: message,
      citations: citations,
      date: new Date(),
      reply: false,
      user: {
        name: user,
        avatar: avatar
      }
    }
  }
}
