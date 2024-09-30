import {Component, Input} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [
    ButtonDirective,
    NgForOf
  ],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss'
})
export class SearchResultComponent {
  @Input() company: string = '';
  @Input() title: string = '';
  @Input() location: string = '';
  @Input() id: number = 0;

  constructor(private router: Router) {

  }

  navigateToDetails() {
    this.router.navigate([`/listings/${this.id}`]);
  }
}
