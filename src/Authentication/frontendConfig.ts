import { appInfo } from './appInfo';
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword';
import Session from 'supertokens-auth-react/recipe/session';

/**
 * SuperTokens client config pointed at qafila-platform.
 * Admin UI uses custom login (POST /api/v1/auth/superuser/login) and stores
 * st-access-token for subsequent /api/superuser/* calls.
 */
export const frontendConfig = () => ({
  appInfo,
  recipeList: [
    EmailPassword.init({
      // Custom Auth.tsx handles the form; disable prebuilt UI.
      style: `
        [data-supertokens~=container] {
          display: none;
        }
      `,
    }),
    Session.init({
      tokenTransferMethod: 'header',
    }),
  ],
});
