import React from "react";
import { Navigation } from "./src/navigation/navigation";
import { extendTheme, NativeBaseProvider } from "native-base";
// internal
import { themeConfig } from "./src/theme/theme.config";

export default function App() {
  const theme = extendTheme(themeConfig());

  return (
    <NativeBaseProvider theme={theme}>
      <Navigation />
    </NativeBaseProvider>
  );
}
