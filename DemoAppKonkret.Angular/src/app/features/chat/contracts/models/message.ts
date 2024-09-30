import {CitationInformationResponse} from "../responses/chatResponse";

export interface Message{
  text: string;
  citations?: CitationInformationResponse[];
  date: Date;
  reply: boolean;
  user: {
    name: string;
    avatar?: string;
  }
}
