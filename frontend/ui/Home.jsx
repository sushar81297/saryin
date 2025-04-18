import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Button } from "react-native-paper";
import UserList from "../components/home/UserList";
import UserPagination from "../components/home/UserPagination";
import UserRegistrationDialog from "../components/home/UserRegistrationDialog";
import UserSearch from "../components/home/UserSearch";
import axios from "axios";

const API_URL = "https://fcc9-119-8-42-125.ngrok-free.app/api";

const HomeScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const [dialogVisible, setDialogVisible] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    phoneNumber: "",
    totalCredit: 0,
    totalDebit: 0,
    remark: "",
  });
  const [registering, setRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  const fetchUsers = async (page = 1, name = "", phoneNumber = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users`, {
        params: {
          page,
          limit: 10,
          name,
          phoneNumber,
        },
      });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    setNameFilter(searchQuery);
    setPhoneFilter(searchQuery);
    fetchUsers(1, searchQuery, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setNameFilter("");
    setPhoneFilter("");
    fetchUsers(1, "", "");
  };

  const handlePageChange = (newPage) => {
    fetchUsers(newPage, nameFilter, phoneFilter);
  };

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => {
    setDialogVisible(false);
    setNewUser({
      name: "",
      phoneNumber: "",
      totalCredit: 0,
      totalDebit: 0,
      remark: "",
    });
    setRegistrationError("");
  };

  const handleInputChange = (field, value) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handleRegisterUser = async () => {
    if (!newUser.name.trim()) {
      setRegistrationError("နာမည်ထည့်ရန် လိုအပ်ပါသည်");
      return;
    }

    setRegistering(true);
    setRegistrationError("");

    try {
      const res = await axios.post(`${API_URL}/users`, {
        ...newUser,
        totalCredit: 0,
        totalDebit: 0,
      });
      if (res.data?._id) {
        await axios.post(`${API_URL}/balance`, {
          credit: parseFloat(newUser.totalCredit),
          debit: parseFloat(newUser.totalDebit),
          userId: res.data?._id,
        });
      }

      fetchUsers(1, nameFilter, phoneFilter);
      hideDialog();
    } catch (error) {
      console.error("Error registering user:", error);
      setRegistrationError(
        error.response?.data?.message || "Failed to register user"
      );
    } finally {
      setRegistering(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stickyHeader}>
        <Button
          mode="contained"
          icon="plus"
          onPress={showDialog}
          style={styles.addButton}
        >
          စာရင်းအသစ်ထည့်ရန်
        </Button>

        <UserSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleClearSearch={handleClearSearch}
        />
      </View>

      <UserList
        users={users}
        loading={loading}
        navigation={navigation}
        onRefresh={fetchUsers}
      />

      <UserPagination
        pagination={pagination}
        handlePageChange={handlePageChange}
      />

      <UserRegistrationDialog
        visible={dialogVisible}
        hideDialog={hideDialog}
        newUser={newUser}
        handleInputChange={handleInputChange}
        handleRegisterUser={handleRegisterUser}
        registering={registering}
        registrationError={registrationError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  stickyHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 3,
    zIndex: 1000,
  },
  addButton: {
    marginBottom: 10,
    backgroundColor: "#2196F3",
  },
});

export default HomeScreen;
