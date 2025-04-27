import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import BeanRegistrationDialog from "../components/bean/BeanRegistrationDialog";
import { Button } from "react-native-paper";
import UserList from "../components/home/UserList";
import UserPagination from "../components/home/UserPagination";
import UserRegistrationDialog from "../components/home/UserRegistrationDialog";
import UserSearch from "../components/home/UserSearch";
import axios from "../api/axiosConfig";
import { useFocusEffect } from "@react-navigation/native";

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
  const [beanDialogVisible, setBeanDialogVisible] = useState(false);
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
      const response = await axios.get(`/users`, {
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

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
      return () => {
        // Optional cleanup if needed
      };
    }, []),
  );

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

  const showDialog = () => {
    setNewUser({
      name: "",
      phoneNumber: "",
      totalCredit: 0,
      totalDebit: 0,
      currentPrice: 0,
      remark: "",
      type: "normal",
    });
    setDialogVisible(true);
  };
  const showBeanDialog = () => {
    setNewUser({
      name: "",
      phoneNumber: "",
      totalCredit: 0,
      totalDebit: 0,
      currentPrice: 0,
      remark: "",
      type: "bean",
    });
    setBeanDialogVisible(true);
  };

  const hideDialog = () => {
    setBeanDialogVisible(false);
    setDialogVisible(false);
    setNewUser({
      name: "",
      phoneNumber: "",
      totalCredit: 0,
      totalDebit: 0,
      currentPrice: 0,
      remark: "",
      type: "",
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
      const res = await axios.post(`/users`, {
        ...newUser,
        totalCredit: 0,
        totalDebit: 0,
      });
      if (res.data?._id && (newUser.totalCredit || newUser.totalDebit)) {
        await axios.post(`/balance`, {
          credit: parseFloat(newUser.totalCredit),
          debit: parseFloat(newUser.totalDebit),
          remark: newUser.remark || "",
          userId: res.data?._id,
        });
      }

      fetchUsers(1, nameFilter, phoneFilter);
      hideDialog();
    } catch (error) {
      console.error("Error registering user:", error);
      setRegistrationError(
        error.response?.data?.message || "Failed to register user",
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
          ငွေစာရင်းအသစ်ထည့်ရန်
        </Button>

        <Button
          mode="contained"
          icon="plus"
          onPress={showBeanDialog}
          style={styles.addButton}
        >
          ပဲစာရင်းအသစ်ထည့်ရန်
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

      <BeanRegistrationDialog
        visible={beanDialogVisible}
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
