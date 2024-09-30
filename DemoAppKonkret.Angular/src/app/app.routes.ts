import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'listings',
    loadComponent: () => import('./features/search-results/search-results-container/search-results-container.component')
      .then(m => m.SearchResultsContainerComponent)
  },
  {
    path: 'listings/:id',
    loadComponent: () => import('./features/listings/listing-container/listing-container.component')
      .then(m => m.ListingContainerComponent)
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat/chat-page/chat-page.component').then(m => m.ChatPageComponent)
  },
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  }
];
