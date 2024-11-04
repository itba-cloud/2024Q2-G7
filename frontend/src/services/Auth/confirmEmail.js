import { CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "./UserPool";

export const confirmEmail = async (email, code, name, surname) => {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    const clientMetadata = {
      name: name,
      surname: surname
    }

    user.confirmRegistration(code, true, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(data);
        resolve(data);
      }
    },
      clientMetadata
    );
  });
};
