import UserPool from "./UserPool";

export const signOut = () => {
  return new Promise((resolve, reject) => {
    var cognitoUser = UserPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.signOut(function (err) {
        if (err) {
          console.error("signOut", err);
          reject(err);
          return;
        }
        resolve();
      });
    }
  });
};
