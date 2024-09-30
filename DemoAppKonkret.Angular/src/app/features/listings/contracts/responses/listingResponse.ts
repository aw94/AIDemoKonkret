import {SafeHtml} from "@angular/platform-browser";

export interface ListingResponse {
  descriptionHtml: SafeHtml;
  description: string;
  title: string;
  role: string;
  location: string;
  assignmentPeriod: Date;
  id: number;
  skills: string[];
}
