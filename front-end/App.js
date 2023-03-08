import React from "react";
import { Navigation } from "./src/navigation/navigation";
import { extendTheme, NativeBaseProvider } from "native-base";
// internal
import { themeConfig } from "./src/theme/theme.config";
import { QueryClient, QueryClientProvider } from "react-query";
import { AxiosContextProvider } from "./src/services/axios.context";
import { FirebaseContextProvider } from "./src/services/firebase.context";

const queryClient = new QueryClient();

export default function App() {
  const theme = extendTheme(themeConfig());
  return (
    <QueryClientProvider client={queryClient}>
      <NativeBaseProvider theme={theme}>
        <FirebaseContextProvider>
          <AxiosContextProvider>
            <Navigation />
          </AxiosContextProvider>
        </FirebaseContextProvider>
      </NativeBaseProvider>
    </QueryClientProvider>
  );
}
