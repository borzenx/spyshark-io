import { Configuration, PublicClientApplication } from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: "c4820a16-4060-4b19-a95e-55730da12d74",
    authority: "https://spyshark.b2clogin.com/spyshark.onmicrosoft.com/B2C_1_signupsignin",
    knownAuthorities: ['https://spyshark.b2clogin.com'],
    redirectUri: "https://spyshark-io.azurewebsites.net",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

