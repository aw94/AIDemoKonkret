import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, switchMap} from "rxjs";
import {ListingResponse} from "./contracts/responses/listingResponse";
import {RetrieveCVRecommendationResponse} from "./contracts/responses/fetchRecommendedEmployeesResponse";
import {BedrockAgentService} from "../../shared/aws-bedrock/bedrock-agent.service";
import {KnowledgeBaseRetrievalResult} from "@aws-sdk/client-bedrock-agent-runtime";
import {EmployeeScore} from "./contracts/models/employeeScore";
import {InvokeModelCommandOutput} from "@aws-sdk/client-bedrock-runtime";
import {BedrockService} from "../../shared/aws-bedrock/bedrock.service";

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private baseUrl: string = 'http://127.0.0.1:5186';

  constructor(private bedrockService: BedrockService, private bedrockAgentService: BedrockAgentService, private httpClient: HttpClient) {
  }

  getListing(id: number): Observable<ListingResponse> {
    return this.httpClient.get<ListingResponse>(`${this.baseUrl}/listing/${id}`);
  }

  /**
   * Fetches matched CVs for a given listing based off of documents in the knowledge base.
   * Then sends the skills in the retrieved CVs to the model to generate a score for each employee.
   */
  fetchRecommendedEmployees(listing: ListingResponse): Observable<RetrieveCVRecommendationResponse[]> {
    let recommendedCVs: RetrieveCVRecommendationResponse[] = [];
    const prompt = this.bedrockAgentService.getCVRecommendationPrompt(listing.skills);
    return this.bedrockAgentService
      .retrieveDocumentsWithoutGeneratingReply(prompt)
      .pipe(switchMap(matchedCVs => {
          let duplicateCVsRemoved = this.removeDuplicateCVsResults(matchedCVs.retrievalResults);
          recommendedCVs = this.mapRetrievedResponse(duplicateCVsRemoved);
          const employeeSkillsAsJson = recommendedCVs.map(response => this.convertEmployeeProfileToJsonString(response));
          return this.bedrockService.invokeModel(this.bedrockService.generateScoreTemplate(listing.skills, employeeSkillsAsJson));
        }), map((aiScoreResponse: InvokeModelCommandOutput) => {
          this.setScores(recommendedCVs, aiScoreResponse);
          return recommendedCVs;
        })
      );
  }

  /**
   * Sets the scores for each employee based on the model's output.
   */
  private setScores(responses: RetrieveCVRecommendationResponse[], response: InvokeModelCommandOutput) {
    const scoresExtracted = this.parseScoreResponse(JSON.parse(response.body.transformToString()).content[0].text);
    scoresExtracted.forEach(score => {
      const response = responses.find(response => response.employeeName.toLowerCase() === score.Name.toLowerCase());
      if (response) {
        response.score = score.Score;
        response.reasoning = score.Reasoning;
      }
    });
  }

  /**
   * Converts an employee profile to a JSON string format.
   */
  private convertEmployeeProfileToJsonString(employeeProfile: RetrieveCVRecommendationResponse): string {
    return JSON.stringify({employeeName: employeeProfile.employeeName, skills: employeeProfile.skills.join(', ')});
  }

  private mapRetrievedResponse(retrievalResults: KnowledgeBaseRetrievalResult[]): RetrieveCVRecommendationResponse[] {
    return retrievalResults.map(retrievalResult => new RetrieveCVRecommendationResponse(retrievalResult));
  }

  /**
   * Removes duplicate entries from the list of retrieval results based on the employee name.
   */
  private removeDuplicateCVsResults(retrievalResults: KnowledgeBaseRetrievalResult[] | undefined) {
    if (retrievalResults) {
      return retrievalResults.filter((currentValue, index, allValues) => allValues
        .findIndex(t => t.metadata && currentValue.metadata && (t.metadata['name'] === currentValue.metadata['name'])) === index);
    }
    return [];
  }

  /**
   * Parses the score response from the model's output.
   * TODO: A better approach would be to use custom formatting in the template to avoid parsing the response.
   */
  private parseScoreResponse(responseString: string): EmployeeScore[] {
    const start = responseString.indexOf('[');
    const end = responseString.lastIndexOf(']');
    const substring = responseString.substring(start, end + 1);
    return JSON.parse(substring);
  }
}
