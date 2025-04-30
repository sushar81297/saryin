import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import BeanScreen from "./ui/Bean";
import CategoryScreen from "./ui/Category";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./ui/Home";
import LoginScreen from "./ui/Login";
import MoneyScreen from "./ui/Money";
import { NavigationContainer } from "@react-navigation/native";
import PriceHistory from "./ui/PriceHistory";
import PriceScreen from "./ui/Price";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import UserDetailScreen from "./ui/UserDetail";
import { createStackNavigator } from "@react-navigation/stack";
import LogoutButton from "./components/common/LogoutButton";
import { navigationRef } from "./util/NavigationService";

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
          <NavigationContainer ref={navigationRef}>
            <StatusBar style="auto" />
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerRight: () => <LogoutButton />,
              }}
            >
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Category"
                component={CategoryScreen}
                options={{ title: "အမျိုးအစား ရွေးချယ်ပါ" }}
              />
              <Stack.Screen
                name="Bean"
                component={BeanScreen}
                options={{ title: "ပဲစာရင်း" }}
              />
              <Stack.Screen
                name="Money"
                component={MoneyScreen}
                options={{ title: "အကြွေးစာရင်း" }}
              />
              <Stack.Screen
                name="Price"
                component={PriceScreen}
                options={{ title: "ပစ္စည်းစာရင်း" }}
              />
              <Stack.Screen
                name="PriceHistory"
                component={PriceHistory}
                options={{ title: "ယခင်စျေးနူန်း" }}
              />
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
