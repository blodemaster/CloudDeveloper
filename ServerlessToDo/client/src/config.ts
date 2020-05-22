// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '5qy1x35ip6'
export const apiEndpoint = `https://${apiId}.execute-api.eu-north-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-tqbsljq5.eu.auth0.com',            // Auth0 domain
  clientId: 'H3J3UEHQDWIHs5OHb5wI4BpMhhSrey9R',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
