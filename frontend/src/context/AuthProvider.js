import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthService } from "../services/AuthService";
import DataLoader from "../components/DataLoader";

const AuthContext = createContext({
  session: null,
  setSession: () => {},
  loading: true,
});

export const useAuthNew = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthService.getSession()
      .then((session) => {
        console.log("AuthProvider:", session);
        if (session) {
          setSession(session);
        }
      })
      .catch((error) => {
        console.log("AuthProvider:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <DataLoader spinnerMultiplier={2} isLoading={loading}></DataLoader>
      </>
    );
  }

  return (
    <AuthContext.Provider value={{ session, setSession, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
