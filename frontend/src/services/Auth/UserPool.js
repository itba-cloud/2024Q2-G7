import { CognitoUserPool } from "amazon-cognito-identity-js";
import { cognito } from "../../common";

const poolData = {
  UserPoolId: cognito.USER_POOL_ID,
  ClientId: cognito.CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);

export default userPool;