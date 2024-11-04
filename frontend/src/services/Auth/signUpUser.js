import UserPool from "./UserPool";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";

export const signUpUser = async (email, name, surname, password) => {
  const attributeList = [];

  //TODO check
  attributeList.push(new CognitoUserAttribute({ Name: "email", Value: email }));
  attributeList.push(new CognitoUserAttribute({ Name: "custom:role", Value: "user" }));

  const clientMetadata = {
    name: name,
    surname: surname
  }

  return new Promise((resolve, reject) => {
    UserPool.signUp(email, password, attributeList, null, (err, data) => {
      if (err) {
        console.error("signUpUser: ERROR", err);
        return reject(new Error(JSON.stringify(err))); 
      }

      console.log("signUpUser: BIEN");
      console.log("signUpUser: " + JSON.stringify(data));
      resolve(data);  
    }, clientMetadata);
  });
  /* try {
    UserPool.signUp(email, password, attributeList, null, (err, data) => {
      if (err) {
        console.log("signUpUser: ERROR");
        console.error(err);
        //return err
        throw new Error(err)
      }
      console.log("signUpUser: BIEN");
      console.log("signUpUser: " + JSON.stringify(data));
      return data;
    },
      clientMetadata
    );
  } catch (error) {
    console.error("signUp: ", error);
    throw error;
  } */
};
