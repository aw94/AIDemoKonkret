import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {ChatResponse, CitationInformationResponse} from "./contracts/responses/chatResponse";
import {BedrockAgentService} from "../../shared/aws-bedrock/bedrock-agent.service";
import {Citation} from "@aws-sdk/client-bedrock-agent-runtime";
import {AwsKnowledgebaseMetadataKeys} from "../../shared/aws-bedrock/config/awsKnowledgebaseMetadataKeys";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private bedrockService: BedrockAgentService) {}


  public sendMessage(message: string): Observable<ChatResponse> {
    return this.bedrockService.retrieveAndGenerateWithDefaultTemplate(message).pipe(map((response) => {
      return {
        outputText: response.output?.text,
        citations: this.toCitationInformationResponse(response.citations)
      } as ChatResponse;
    }));
  }

  private toCitationInformationResponse(response: Citation[] | undefined): CitationInformationResponse[] | undefined {
    let citations: CitationInformationResponse[];
    citations = response?.flatMap((citation) =>
      citation.retrievedReferences?.filter(c => c.metadata)
        .map((retrievedReference) => ({
        skills: retrievedReference?.metadata![AwsKnowledgebaseMetadataKeys.SKILLS]?.toString().split(',') ?? [],
        textReference: retrievedReference?.content?.text ?? '',
        url: retrievedReference?.location?.s3Location?.uri ?? '',
        documentName: retrievedReference?.metadata![AwsKnowledgebaseMetadataKeys.NAME]?.toString() ?? ''
      })) ?? []
    ) ?? [];
    return citations;
  }
}
