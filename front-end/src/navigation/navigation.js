import * as React from "react";
import { Platform } from "react-native";
import * as Linking from "expo-linking";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { SongCreateScreen } from "../screens/song-create.screen";
import { SongDetailScreen } from "../screens/song-detail.screen";
import { appRoutesConfig } from "./route.config";

const Stack = createStackNavigator();

export const Navigation = () => (
  <NavigationContainer
    documentTitle={{
      enabled: false,
    }}
    linking={
      Platform.OS === "web"
        ? {
            enabled: true,
            config: appRoutesConfig,
            prefixes: [Linking.createURL("/"), "https://songGPT.xyz/"],
          }
        : undefined
    }
  >
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SongCreate" component={SongCreateScreen} />
      <Stack.Screen name="SongDetail" component={SongDetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
