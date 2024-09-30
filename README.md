## DemoAppKonkret

### Overview

**MVP app using AWS Bedrock AI**  
Simple project for retrieving documents from a knowledge base and generating replies with AWS Bedrock and Bedrock Agents.

**DemoAppKonkret.API**  
The backend of this project is an ASP.NET Core Web API that serves as an intermediary to fetch data from a third-party API. This backend was developed specifically to address CORS issues encountered when attempting to access the API directly from the frontend application.

**DemoAppKonkret.Angular**  
The frontend of this project is an Angular application designed to retrieve documents and generate replies using
<a href="https://www.npmjs.com/package/@aws-sdk/client-bedrock-agent-runtime">@aws-sdk/client-bedrock-agent-runtime</a> and 
<a href="https://www.npmjs.com/package/@aws-sdk/client-bedrock-runtime">@aws-sdk/client-bedrock-runtime</a>.  
It communicates with the backend API to retrieve the necessary data and provide a seamless user experience.

