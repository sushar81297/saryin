import { StyleSheet, Text, View } from "react-native";

import { IconButton } from "react-native-paper";
import React from "react";

const UserPagination = ({ pagination, handlePageChange }) => {
  const { currentPage, totalPages } = pagination;
  return (
    <View style={styles.paginationContainer}>
      <IconButton
        icon="chevron-left"
        size={24}
        disabled={currentPage <= 1}
        onPress={() => handlePageChange(currentPage - 1)}
      />

      <Text style={styles.paginationText}>
        Page {currentPage} of {totalPages}
      </Text>

      <IconButton
        icon="chevron-right"
        size={24}
        disabled={currentPage >= totalPages}
        onPress={() => handlePageChange(currentPage + 1)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  paginationText: {
    fontSize: 14,
  },
});

export default UserPagination;
