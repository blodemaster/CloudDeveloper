import auth0 from "auth0-js";
import { authConfig } from "../config";

export default class Auth {
  accessToken;
  idToken;
  expiresAt;

  auth0 = new auth0.WebAuth({
    domain: authConfig.domain,
    clientID: authConfig.clientId,
    redirectUri: authConfig.callbackUrl,
    responseType: "token id_token",
    scope: "openid",
  });

  constructor(history) {
    this.history = history;

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.history.push("/");
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  getIdToken() {
    return localStorage.getItem("idToken");
  }

  getExpireAt() {
    return localStorage.getItem("expiresAt");
  }

  setSession(authResult) {
    localStorage.setItem("accessToken", authResult.accessToken);
    localStorage.setItem("idToken", authResult.idToken);
    // Set the time that the access token will expire at
    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    localStorage.setItem("expiresAt", expiresAt);

    // navigate to the home route
    this.history.push("/");
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.log(err);
        alert(
          `Could not get a new token (${err.error}: ${err.error_description}).`
        );
      }
    });
  }

  logout() {
    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("expiresAt");
    this.auth0.logout({
      return_to: window.location.origin,
    });

    // navigate to the home route
    this.history.push("/");
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.getExpireAt();
    return new Date().getTime() < expiresAt;
  }
}
