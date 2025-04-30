import { IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";

const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" as never }],
    });
  };
  return <IconButton icon="logout" size={24} onPress={handleLogout} />;
};

export default LogoutButton;
