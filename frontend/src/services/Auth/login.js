import { authenticate } from "./authenticate";

export const login = async (email, password) => {
  try {
    const data = await authenticate(email, password);
    return data;
  } catch (err) {
    console.error("login:", err);
    throw err;
  }
};
