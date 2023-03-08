import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SongCreateScreen } from "../screens/song-create.screen";
import { SongDetailScreen } from "../screens/song-detail.screen";

const Stack = createStackNavigator();

export const Navigation = () => (
  <NavigationContainer
    documentTitle={{
      enabled: false,
    }}
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
