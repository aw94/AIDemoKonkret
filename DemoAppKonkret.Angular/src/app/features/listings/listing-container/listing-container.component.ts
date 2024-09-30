import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CardModule} from "primeng/card";
import {BehaviorSubject, interval, Subscription, switchMap} from "rxjs";
import {ListingService} from "../listing.service";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {AsyncPipe, DatePipe, NgForOf} from "@angular/common";
import {TagModule} from "primeng/tag";
import {DomSanitizer} from '@angular/platform-browser';
import {RetrieveCVRecommendationResponse} from "../contracts/responses/fetchRecommendedEmployeesResponse";
import {MatchedEmployeeComponent} from "../matched-employee/matched-employee.component";
import {SkeletonModule} from "primeng/skeleton";
import {ListingResponse} from "../contracts/responses/listingResponse";

@Component({
  selector: 'app-listing-container',
  standalone: true,
  imports: [
    CardModule,
    ProgressSpinnerModule,
    DatePipe,
    TagModule,
    NgForOf,
    AsyncPipe,
    MatchedEmployeeComponent,
    SkeletonModule
  ],
  templateUrl: './listing-container.component.html',
  styleUrl: './listing-container.component.scss'
})
export class ListingContainerComponent implements OnInit {
  listing: ListingResponse | undefined;
  recommendedEmployees: BehaviorSubject<RetrieveCVRecommendationResponse[] | undefined> = new BehaviorSubject<RetrieveCVRecommendationResponse[] | undefined>(undefined);
  recommendedEmployees$ = this.recommendedEmployees.asObservable();
  timerSignal = signal(0);
  private subscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private listingService: ListingService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.startTimer();
    this.route.params.pipe(switchMap((params) => {
      const id = params['id'];
      return this.listingService.getListing(id);
    }), switchMap(listingResponse => {
        this.listing = listingResponse;
        // Description from API is in HTML format, so it needs to be sanitized
        this.listing.descriptionHtml = this.sanitizer.bypassSecurityTrustHtml(this.listing.description);
        return this.listingService.fetchRecommendedEmployees(listingResponse);
      }
    )).subscribe((recommendations) => {
      const sortedByScore = recommendations.sort((a, b) => b.score - a.score);
      this.recommendedEmployees.next(sortedByScore);
      this.stopTimer()
    });
  }

  startTimer() {
    this.subscription = interval(1000).subscribe(() => {
      this.timerSignal.update(fn => fn + 1);
    });
  }

  stopTimer() {
    this.subscription.unsubscribe();
  }
}
