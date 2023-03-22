import * as React from "react";
import { Platform } from "react-native";
import * as Linking from "expo-linking";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// internal
import { appRoutesConfig } from "./route.config";
import { SongListScreen } from "src/features/songs/screens/song-list.screen";
import { SongDetailScreen } from "src/features/songs/screens/song-detail.screen";
import { SongCreateScreen } from "src/features/songs/screens/song-create.screen";

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
      <Stack.Screen name="SongList" component={SongListScreen} />
      <Stack.Screen name="SongCreate" component={SongCreateScreen} />
      <Stack.Screen name="SongDetail" component={SongDetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
