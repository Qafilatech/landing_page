
import EmailPasswordNode from 'supertokens-node/recipe/emailpassword'
import SessionNode from 'supertokens-node/recipe/session'
import { appInfo } from './appInfo'
import { TypeInput } from "supertokens-node/types";
import * as dotenv from "dotenv";

dotenv.config();

console.log('TEst',process.env.SUPERTOKENS_CONNECTION_URI)

console.log('API',process.env.SUPATOKSUPERTOKENS_API)


export const backendConfig = (): TypeInput => {
  return {
    framework: "express",
    supertokens: {
        connectionURI: process.env.SUPERTOKENS_CONNECTION_URI || "https://try.supertokens.com",
      apiKey: process.env.SUPATOKSUPERTOKENS_API,
    },
    appInfo,
    recipeList: [
      EmailPasswordNode.init(),
      SessionNode.init(),
    ],
    isInServerlessEnv: true,
  }
}
