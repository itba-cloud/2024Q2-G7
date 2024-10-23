import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "./UserPool";

export const authenticate = (email, password) => {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        console.log("onSuccess authenticateUser:", data);
        resolve(data);
      },

      onFailure: (err) => {
        console.error("onFailure authenticateUser:", err);
        reject(err);
      },
    });
  });
};

/* export const logout = () => {
  const user = UserPool.getCurrentUser();
  if (user) {
    user.signOut();
  }
}; */
