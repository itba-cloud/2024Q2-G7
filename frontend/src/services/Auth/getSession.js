import UserPool from "./UserPool";

export const getSession = () => {
  return new Promise((resolve, reject) => {
    var cognitoUser = UserPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          console.error("getSession ERROR -", err);
          reject(err);
          return;
        }
        console.log("session validity: " + session.isValid());
        resolve(session);
      });
    } else {
      reject(new Error("No current user found"));
    }
  });
};
