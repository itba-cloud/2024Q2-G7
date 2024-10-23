import { CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "./UserPool";

export const resendCode = async (email) => {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    user.resendConfirmationCode((err, data) => {
      if (err) {
        console.error("resendCode: ", err);
        reject(err);
      } else {
        console.log("resendCode: ", data);
        resolve(data);
      }
    });
  });
};
