import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { resetRoot } from "../util/NavigationService";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // optional
});

instance.interceptors.request.use(
  async (config) => {
    const userCredentialString = await AsyncStorage.getItem("userCredential");
    const userCredential = userCredentialString
      ? JSON.parse(userCredentialString)
      : null;
    if (userCredential && userCredential.token) {
      config.headers.Authorization = `Bearer ${userCredential.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.clear();
      resetRoot("Login");
    }

    return Promise.reject(error);
  },
);

export default instance;
