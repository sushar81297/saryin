import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./ui/Home";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import UserDetailScreen from "./ui/UserDetail";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2196F3",
    accent: "#03A9F4",
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "စာရင်း" }}
              />
              <Stack.Screen
                name="UserDetail"
                component={UserDetailScreen}
                options={{ title: "စာရင်း အသေးစိတ်" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
