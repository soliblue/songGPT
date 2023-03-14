import React from "react";
import { Navigation } from "src/navigation/navigation";
import { extendTheme, NativeBaseProvider } from "native-base";
// internal
import { themeConfig } from "src/theme/theme.config";
import { QueryClient, QueryClientProvider } from "react-query";
import { AxiosContextProvider } from "src/services/axios.context";
import { FirebaseContextProvider } from "src/services/firebase.context";
import { PlayerContextProvider } from "src/services/player.context";

const queryClient = new QueryClient();

const config = {
  dependencies: {
    "linear-gradient": require("expo-linear-gradient").LinearGradient,
  },
};

export default function App() {
  const theme = extendTheme(themeConfig());
  return (
    <QueryClientProvider client={queryClient}>
      <NativeBaseProvider theme={theme} config={config}>
        <FirebaseContextProvider>
          <AxiosContextProvider>
            <PlayerContextProvider>
              <Navigation />
            </PlayerContextProvider>
          </AxiosContextProvider>
        </FirebaseContextProvider>
      </NativeBaseProvider>
    </QueryClientProvider>
  );
}
