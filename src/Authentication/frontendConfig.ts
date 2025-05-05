// import EmailPasswordWebJs from 'supertokens-web-js/recipe/emailpassword'
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword';
import Session from "supertokens-auth-react/recipe/session";
import { appInfo } from './appInfo'
import Auth from '@/pages/Auth';

export const frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
      EmailPassword.init({
        signInAndUpFeature: {
            signInForm: {
                    formFields: [{
                        id: "email",
                        label: "Your Email",
                        getDefaultValue: () => "john.doe@gmail.com"
                    }]
                }
        }
      }),
      Session.init(),
    ],
  };
}