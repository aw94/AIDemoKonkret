import {Injectable} from '@angular/core';
import {from, map, Observable} from "rxjs";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
  InvokeModelCommandOutput
} from "@aws-sdk/client-bedrock-runtime";
import {AwsBedrockClaude} from "./models/awsBedrockClaude";
import {BedrockConfigService} from "./bedrock-config.service";
import {ScoredTemplate} from "./templates/scoredTemplate";

// This service is responsible for invoking the model to generate a response based on the prompt.
// Does not use document retrieval from a knowledge base.
@Injectable({
  providedIn: 'root'
})
export class BedrockService {

  private bedRockClient!: BedrockRuntimeClient;

  constructor(bedrockConfigService: BedrockConfigService) {
    this.bedRockClient = new BedrockRuntimeClient(bedrockConfigService.getAwsCredentialsConfig());
  }


  invokeModel(prompt: string): Observable<InvokeModelCommandOutput> {
    const command = new InvokeModelCommand(this.createInvokeModelCommandInput(prompt));
    return from(this.bedRockClient.send(command)).pipe(map((response) => {

      return response;
    }))
  }

  public generateScoreTemplate(jobSkills: string[], employeeProfiles: string[]): string {
    return ScoredTemplate.replace("$profiles$", employeeProfiles.join(',')).replace("$description$", jobSkills.join(','));
  }

  private createInvokeModelCommandInput(prompt: string): InvokeModelCommandInput {
    const payload = {
      anthropic_version: AwsBedrockClaude.anthropic_version,
      max_tokens: AwsBedrockClaude.max_tokens,
      messages: [
        {
          role: "user",
          content: [{type: "text", text: prompt}],
        },
      ],
    };
    return {
      accept: "application/json",
      body: JSON.stringify(payload),
      modelId: AwsBedrockClaude.claudeModelArn,
    };
  }

}
