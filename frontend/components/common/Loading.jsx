import { ActivityIndicator } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import React from "react";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2196f3",
    justifyContent: "center",
    alignItems: "center",
  },
});
