import React from "react";
import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

export const AxiosContext = React.createContext(null);

export const AxiosContextProvider = ({ children }) => {
  const baseURL = "https://api.songgpt.xyz/";
  // const baseURL = "http://localhost:8000/";

  const headers = {
    platform: Platform.OS,
    accept: "application/json",
    version: Constants.manifest.version,
  };

  const client = React.useMemo(() => {
    const temp = axios.create({
      headers: headers,
      baseURL: baseURL,
    });
    console.debug("⚙️ Initialized Axios with baseURL: " + baseURL);
    return temp;
  }, []);

  return (
    <AxiosContext.Provider
      value={{
        client,
      }}
    >
      {children}
    </AxiosContext.Provider>
  );
};
