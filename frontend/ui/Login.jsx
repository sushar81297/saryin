import { Button, Text, TextInput, ActivityIndicator } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import LoadingScreen from "../components/common/Loading";
import axios from "../api/axiosConfig";
import { saveToken, getToken } from "../auth/tokenStorage";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    {
      id: "1",
      name: "အကြွေးစာရင်း",
      icon: "cash",
      routeName: "Money",
      permission: "normal",
    },
    {
      id: "2",
      name: "ပစ္စည်းစာရင်း",
      icon: "tag",
      routeName: "Price",
      permission: "price",
    },
    {
      id: "3",
      name: "ပဲစာရင်း",
      icon: "seed",
      routeName: "Bean",
      permission: "bean",
    },
  ];

  const checkLogin = async () => {
    const response = await getToken("userCredential");
    const userData = response ? JSON.parse(response) : null;
    checkPermission(userData);
  };

  const checkPermission = (userData) => {
    if (userData) {
      const { permissions } = userData;
      let routeName = "Category";

      if (permissions.length === 1) {
        routeName =
          categories.find((item) => item.permission === permissions[0])
            ?.routeName || "Category";
      }

      navigation.reset({
        index: 0,
        routes: [{ name: routeName }],
      });
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const handleLogin = async () => {
    let valid = true;

    if (!username) {
      setErrorUsername("Username is required");
      valid = false;
    } else {
      setErrorUsername("");
    }

    if (!password) {
      setErrorPassword("Password is required");
      valid = false;
    } else {
      setErrorPassword("");
    }

    if (valid) {
      setIsLoading(true);
      try {
        const response = await axios.post(`/auth/login`, {
          login: username,
          password,
        });
        checkPermission(response.data);
        await saveToken(response.data);
      } catch (error) {
        console.error("Error registering user:", error);
        setError("Something went wrong. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const handleInputChange = (value, name) => {
    if (name === "username") {
      setUsername(value);
      setErrorUsername("");
    } else if (name === "password") {
      setPassword(value);
      setErrorPassword("");
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Login</Text>

            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={(value) => handleInputChange(value, "username")}
              style={styles.input}
              mode="flat"
              underlineColor="gray"
              activeUnderlineColor="#2196F3"
            />
            {errorUsername ? (
              <Text style={styles.errorText}>{errorUsername}</Text>
            ) : null}

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(value) => handleInputChange(value, "password")}
              style={styles.input}
              mode="flat"
              secureTextEntry
              underlineColor="gray"
              activeUnderlineColor="#2196F3"
            />
            {errorPassword ? (
              <Text style={styles.errorText}>{errorPassword}</Text>
            ) : null}

            {isLoading ? (
              <ActivityIndicator
                size="large"
                color="white"
                style={{ marginTop: 30 }}
              />
            ) : (
              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
              >
                Login
              </Button>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef", // blue background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#fff", // white background for the form
    padding: 24,
    borderRadius: 12,
    elevation: 5, // shadow
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  input: {
    backgroundColor: "transparent",
    width: "100%",
    marginBottom: 8,
    fontSize: 12,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
    marginLeft: 4,
  },
  loginButton: {
    backgroundColor: "#2196F3",
    marginTop: 20,
    width: "100%",
    borderRadius: 8,
  },
});
