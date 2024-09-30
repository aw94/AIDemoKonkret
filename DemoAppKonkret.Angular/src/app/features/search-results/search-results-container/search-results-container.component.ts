import {Component, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from "../search.service";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {TableModule} from "primeng/table";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {ButtonDirective} from "primeng/button";
import {SearchResultComponent} from "../search-result/search-result.component";
import {SpinnerModule} from "primeng/spinner";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {PaginatorModule, PaginatorState} from "primeng/paginator";
import {ListingSearchResultWrapper} from "../contracts/responses/listingSearchResult";

@Component({
  selector: 'app-search-results-container',
  standalone: true,
  imports: [
    TableModule,
    AsyncPipe,
    NgForOf,
    ButtonDirective,
    NgIf,
    SearchResultComponent,
    SpinnerModule,
    ProgressSpinnerModule,
    PaginatorModule
  ],
  templateUrl: './search-results-container.component.html',
  styleUrl: './search-results-container.component.scss'
})
export class SearchResultsContainerComponent implements OnInit, OnDestroy {
  jobListings: BehaviorSubject<ListingSearchResultWrapper | undefined> = new BehaviorSubject<ListingSearchResultWrapper | undefined>(undefined);
  jobListings$ = this.jobListings.asObservable();
  unsubscribe$ = new Subject<void>();
  isLoading: boolean = false;
  first = 0;
  rows = 20;

  constructor(private searchService: SearchService) {
  }


  ngOnInit(): void {
    this.isLoading = true;
    this.searchService.search(0)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results) => {
        this.jobListings.next(results);
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  onPageChange($event: PaginatorState) {
    const page = $event.page ?? 0;
    this.isLoading = true;
    this.searchService.search(page)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results) => {
        this.jobListings.next(results);
        this.first = $event.first ?? 0;
        this.rows = $event.rows ?? 20;
        window.scrollTo(0, 0);
        this.isLoading = false;
      });
  }
}
