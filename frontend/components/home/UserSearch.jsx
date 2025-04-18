import { IconButton, Searchbar } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import React from "react";

const UserSearch = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleClearSearch,
}) => {
  return (
    <View style={styles.searchContainer}>
      <Searchbar
        placeholder="နာမည် (သို့) ဖုန်းနံပါတ် ရိုက်ထည့်ပါ"
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchBar}
        onClearIconPress={handleClearSearch}
      />
      <IconButton
        icon="magnify"
        size={24}
        iconColor="#FFFFFF"
        onPress={handleSearch}
        style={styles.searchButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    marginRight: 5,
    elevation: 0,
  },
  searchButton: {
    backgroundColor: "#2196F3",
  },
});

export default UserSearch;
