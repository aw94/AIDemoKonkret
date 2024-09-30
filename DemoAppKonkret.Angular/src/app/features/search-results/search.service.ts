import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ListingSearchResult, ListingSearchResultWrapper} from "./contracts/responses/listingSearchResult";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
private baseUrl: string = 'http://127.0.0.1:5186';
  constructor(private httpClient: HttpClient) { }

  search(page: number): Observable<ListingSearchResultWrapper> {
    return this.httpClient.get<ListingSearchResultWrapper>(`${this.baseUrl}/search/listings?page=${page}`);
  }
}
