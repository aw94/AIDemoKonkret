import {Injectable} from '@angular/core';
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
  RetrieveAndGenerateCommandInput,
  RetrieveAndGenerateResponse,
  RetrieveAndGenerateType,
  RetrieveCommand,
  RetrieveCommandInput,
  RetrieveResponse
} from "@aws-sdk/client-bedrock-agent-runtime";
import {from, map, Observable, take} from "rxjs";
import {AwsBedrockClaude} from "./models/awsBedrockClaude";
import {DefaultTemplate} from "./templates/defaultTemplate";
import {BedrockConfigService} from "./bedrock-config.service";

// This service is responsible for retrieving documents from a knowledge base and generating a response based on the prompt.
@Injectable({
  providedIn: 'root'
})
export class BedrockAgentService {
  private bedRockAgentClient!: BedrockAgentRuntimeClient;
  private _sessionId: string | undefined;

  constructor(private bedrockConfigService: BedrockConfigService) {
      this.bedRockAgentClient = new BedrockAgentRuntimeClient(bedrockConfigService.getAwsCredentialsConfig());
  }

  retrieveAndGenerateWithDefaultTemplate(prompt: string): Observable<RetrieveAndGenerateResponse> {
    const sessionId = this.hasSessionId() ? this._sessionId : undefined;
    const command = this.createRetrieveAndGenerateCommand(prompt, DefaultTemplate, sessionId);
    return from(this.bedRockAgentClient.send(command)).pipe(map((response) => {
      this._sessionId = response.sessionId;
      return response;
    }))
  }

  private hasSessionId(): boolean {
    return !!(this._sessionId && this._sessionId.trim().length > 0);
  }

  retrieveDocumentsWithoutGeneratingReply(prompt: string): Observable<RetrieveResponse> {
    const command = new RetrieveCommand(this.createRetrieveCommand(prompt));
    return from(this.bedRockAgentClient.send(command)).pipe(map((response) => {
      return response;
    }))
  }

  public getCVRecommendationPrompt(skills: string[]): string {
    return `I need a list of employees who have the following job skills mentioned in this job description:
            ${skills.join(', ')}. Prioritize candidates whose skills match these exactly or are highly relevant.
            Avoid overemphasizing unrelated technologies unless they complement or closely match the core skills required.
            All key skills should be covered as closely as possible to the job requirements`;
  }


  private createRetrieveAndGenerateCommand(prompt: string, template: string, sessionId?: string): RetrieveAndGenerateCommand {
    const params: RetrieveAndGenerateCommandInput = {
      retrieveAndGenerateConfiguration: {
        knowledgeBaseConfiguration: {
          knowledgeBaseId: this.bedrockConfigService.config.knowledgeBaseId,
          modelArn: AwsBedrockClaude.claudeModelArn,
          generationConfiguration: {
            promptTemplate: {
              textPromptTemplate: template
            }
          }
        },
        type: RetrieveAndGenerateType.KNOWLEDGE_BASE
      },
      sessionId: sessionId,
      input: {
        text: prompt
      }
    };

    return new RetrieveAndGenerateCommand(params);
  }


  private createRetrieveCommand(prompt: string): RetrieveCommandInput {
    return {
      knowledgeBaseId: this.bedrockConfigService.config.knowledgeBaseId,
      retrievalConfiguration: {
        vectorSearchConfiguration: {
          numberOfResults: 10
        }
      },
      retrievalQuery: {
        text: prompt
      },
    }
  }
}
