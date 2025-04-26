import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "userCredential";

export const saveToken = async (data) => {
  await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(data));
};

export const getToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};
