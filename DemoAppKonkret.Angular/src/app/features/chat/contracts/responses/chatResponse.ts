export interface ChatResponse {
  outputText: string;
  citations: CitationInformationResponse[];
}

export interface CitationInformationResponse {
  documentName: string;
  textReference: string;
  url: string;
  skills: string[];
}
