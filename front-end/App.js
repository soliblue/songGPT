import React from "react";
import { Navigation } from "src/navigation/navigation";
import { extendTheme, NativeBaseProvider, Spinner, VStack } from "native-base";
import {
  Recursive_300Light,
  Recursive_400Regular,
  Recursive_500Medium,
  Recursive_600SemiBold,
  Recursive_700Bold,
  Recursive_800ExtraBold,
  Recursive_900Black,
  useFonts,
} from "@expo-google-fonts/recursive";
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
  const [fontsLoaded] = useFonts({
    Recursive_300Light,
    Recursive_400Regular,
    Recursive_500Medium,
    Recursive_600SemiBold,
    Recursive_700Bold,
    Recursive_800ExtraBold,
    Recursive_900Black,
  });
  const theme = extendTheme(themeConfig());
  if (!fontsLoaded) {
    return <></>;
  }
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
