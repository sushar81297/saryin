import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const loginUser = async (payload) => {
  const response = await axios.post(`${API_URL}/auth/login`, payload);
  return response.data;
};
