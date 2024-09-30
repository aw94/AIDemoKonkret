export interface ListingSearchResult {
  title: string;
  location: string;
  company: string;
  id: number;
}

export interface ListingSearchResultWrapper {
  searchResults: ListingSearchResult[];
  totalPages: number;
  last: boolean;
}
