import {KnowledgeBaseRetrievalResult} from "@aws-sdk/client-bedrock-agent-runtime";
import {AwsKnowledgebaseMetadataKeys} from "../../../../shared/aws-bedrock/config/awsKnowledgebaseMetadataKeys";

export class RetrieveCVRecommendationResponse {
  employeeName: string;
  documentName: string;
  languages: string[];
  location: string;
  skills: string[];
  score: number = 0;
  reasoning: string | undefined;
  metadata: RetrieveEmployeeRecommendationMetadataResponse[] = [];

  constructor(retrievalResult: KnowledgeBaseRetrievalResult) {
    if (retrievalResult.metadata) {
      this.documentName = retrievalResult.metadata[AwsKnowledgebaseMetadataKeys.SOURCE_DOCUMENT_NAME]?.toString() ?? '';
      this.employeeName = retrievalResult.metadata[AwsKnowledgebaseMetadataKeys.NAME]?.toString() ?? '';
      this.languages = retrievalResult.metadata[AwsKnowledgebaseMetadataKeys.LANGUAGES]?.toString().split(',') ?? [];
      this.location = retrievalResult.metadata[AwsKnowledgebaseMetadataKeys.SOURCE_DOCUMENT_NAME]?.toString() ?? '';
      this.skills = retrievalResult.metadata[AwsKnowledgebaseMetadataKeys.SKILLS]?.toString().split(',') ?? [];
    }
    else {
      this.documentName = '';
      this.employeeName = '';
      this.languages = [];
      this.location = '';
      this.skills = [];
    }
  }
}

export interface RetrieveEmployeeRecommendationMetadataResponse {
  textReference: string;
}
