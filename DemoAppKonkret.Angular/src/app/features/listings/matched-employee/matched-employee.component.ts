import {Component, Input} from '@angular/core';
import {CardModule} from "primeng/card";
import {DecimalPipe, NgForOf} from "@angular/common";
import {TagModule} from "primeng/tag";
import {RetrieveEmployeeRecommendationMetadataResponse} from "../contracts/responses/fetchRecommendedEmployeesResponse";
import {Button} from "primeng/button";
import {TabViewModule} from "primeng/tabview";
import {FieldsetModule} from "primeng/fieldset";
import {ProgressBarModule} from "primeng/progressbar";

@Component({
  selector: 'app-matched-employee',
  standalone: true,
  imports: [
    CardModule,
    NgForOf,
    TagModule,
    Button,
    TabViewModule,
    FieldsetModule,
    ProgressBarModule,
    DecimalPipe
  ],
  templateUrl: './matched-employee.component.html',
  styleUrl: './matched-employee.component.scss'
})
export class MatchedEmployeeComponent {
@Input() documentName: any;
@Input() textReferences: RetrieveEmployeeRecommendationMetadataResponse[] = [];
@Input() s3Location: any;
@Input() skills: string[] = [];
@Input() employeeName: string = '';
@Input() languages: string[] = [];
@Input() score: number = 0;
@Input() scoreReasoning: string = '';
}
