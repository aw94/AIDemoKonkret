import { Injectable } from '@angular/core';
import {AwsConfig} from "./config/awsConfig";
import {BedrockAgentRuntimeClientConfig} from "@aws-sdk/client-bedrock-agent-runtime";
import {take} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BedrockConfigService {

  private _config!: AwsConfig;
  public get config(): AwsConfig {
    return this._config;
  }
  constructor(private httpClient: HttpClient) {}

  public setConfig(){
    this.fetchConfig().subscribe((config) => {
      this._config = config;
    });
  }
  private fetchConfig() {
    return this.httpClient
      .get<AwsConfig>('assets/awsConfig.json')
      .pipe(take(1));
  }

  public getAwsCredentialsConfig(): BedrockAgentRuntimeClientConfig {
    return {
      region: this._config.region,
      credentials: {
        accessKeyId: this._config.accessKeyId,
        secretAccessKey: this._config.secretAccessKey
      }
    }
  }
}
