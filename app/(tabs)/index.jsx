import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import services from "../../utils/services";
import { useRouter, Link } from "expo-router";
import { client } from "@/utils/KindeConfig";
import Header from "@/components/Header";
import CircularChart from "@/components/CircularChart";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import CategoriesList from "@/components/CategoriesList";
import { CategoriesContext } from "../../context/CategoriesContext";
import supabase from "../../utils/Supabase";

const Home = () => {
  const router = useRouter();
  const { categoriesList, fetchCategories } = useContext(CategoriesContext);

  //handle check user

  const handleAddNewUser = async (given_name, family_name, email, picture) => {
    if (email !== "") {
      try {
        const { data, error } = await supabase
          .from("Users")
          .insert({
            given_name: given_name,
            family_name: family_name,
            email: email,
            picture: picture,
          })
          .select();
        if (error) console.log(error);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getUsersList = async () => {
    try {
      let { data, error } = await supabase.from("Users").select("*");
      if (error) {
        console.log(error);
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  //handle auto add notifications

  const { fetchNotifications } = useContext(CategoriesContext);

  // fetch push notifications
  const pushNotifications = async (name, detail, dateNoti, ref) => {
    try {
      const user = await client.getUserDetails();

      const { data, error } = await supabase
        .from("Notifications")
        .insert([
          {
            name: name,
            detail: detail,
            icon: "",
            color: "",
            forUser: user.email,
            dateNoti: dateNoti,
            ref: ref,
          },
        ])
        .select();
      fetchNotifications();
    } catch (error) {
      console.error("add budget plan notification err: ", error);
    }
  };

  //auto add notifications for budget plan
  const AutoAddNotificationsForBudgetPlans = (budgetPlans, notifications) => {
    budgetPlans.forEach((item) => {
      const toDay = new Date();
      const dateEnd = new Date(item.dateEnd);
      const dif =
        dateEnd.getMonth() === toDay.getMonth() &&
        dateEnd.getFullYear() === toDay.getFullYear()
          ? dateEnd.getDay() - toDay.getDay()
          : 100;
      const percentage = (parseInt(item.progress) / parseInt(item.money)) * 100;
      const roundedPerc = percentage.toFixed(2);
      dateNoti = toDay.toLocaleDateString();
      const checkIfAlreadyPushNotification =
        notifications.length > 0
          ? notifications.find((n) => {
              return n.dateNoti == dateNoti;
            })
          : false;
      if (!checkIfAlreadyPushNotification) {
        if (dif === 3 || dif === 2 || dif === 1) {
          pushNotifications(
            "Thông báo về Kế hoạch chi tiêu",
            `kế hoạch ${
              item.name
            } đã đạt ${roundedPerc}% và sẽ kết thúc trong ${
              dateEnd - toDay
            } ngày nữa.`,
            dateNoti,
            "budget-plan"
          );
        }
        if (dif === 0) {
          pushNotifications(
            "Thông báo về Kế hoạch chi tiêu",
            `đã đến hạn hoàn thành kế hoạch chi tiêu. tiến độ hiện tại ${roundedPerc}%`,
            dateNoti,
            "budget-plan"
          );
        }
        if (roundedPerc >= 90) {
          pushNotifications(
            "Thông báo về Kế hoạch chi tiêu",
            `chúc mừng, kế hoạch chi tiêu đạt ${roundedPerc}%`,
            dateNoti,
            "budget-plan"
          );
        }
      }
    });
  };

  //auto add notifications for periodic invoices
  const AutoAddNotificationsForPeriodicInvoices = (
    periodicInvoices,
    notifications
  ) => {
    periodicInvoices.forEach((item) => {
      const toDay = new Date();
      let dateOfTerm = new Date();
      let dif = 0;

      switch (parseInt(item.period)) {
        case 1: // Weekly
          const dayOfWeek = [
            "sun",
            "mon",
            "tue",
            "wed",
            "thu",
            "fri",
            "sat",
          ].indexOf(item.time.toLowerCase());
          dateOfTerm.setDate(
            toDay.getDate() + ((dayOfWeek + 7 - toDay.getDay()) % 7)
          );
          dif = Math.floor((dateOfTerm - toDay) / (1000 * 60 * 60 * 24));
          break;
        case 2: // Monthly
          dateOfTerm.setDate(parseInt(item.time));
          if (dateOfTerm < toDay) {
            dateOfTerm.setMonth(toDay.getMonth() + 1);
          }
          dif = Math.floor((dateOfTerm - toDay) / (1000 * 60 * 60 * 24));
          break;
        case 3: // Yearly
          const [day, month] = item.time.split("/").map(Number);
          dateOfTerm = new Date(toDay.getFullYear(), month - 1, day);
          if (dateOfTerm < toDay) {
            dateOfTerm.setFullYear(toDay.getFullYear() + 1);
          }
          dif = Math.floor((dateOfTerm - toDay) / (1000 * 60 * 60 * 24));
          break;
        default:
          dif = 100; // Default to a large number to skip notification
      }

      const dateNoti = toDay.toLocaleDateString();

      const checkIfAlreadyPushNotification =
        notifications.length > 0
          ? notifications.find((n) => {
              return n.dateNoti == dateNoti;
            })
          : false;
      if (!checkIfAlreadyPushNotification) {
        if (dif === 3 || (dif === 2) | (dif === 1)) {
          pushNotifications(
            "Thông báo về hóa đơn định kì",
            `Hóa đơn ${item.name} cần phải hoàn thành trong ${dif} ngày nữa.`,
            dateNoti,
            "periodic-invoices"
          );
        }
        if (dif === 0) {
          pushNotifications(
            "Thông báo về hóa đơn định kì",
            `Hóa đơn ${item.name} cần phải hoàn thành trong ngày hôm nay.`,
            dateNoti,
            "periodic-invoices"
          );
        }
      }
    });
  };

  //auto add notifications for installments
  const AutoAddNotificationsForInstallments = (installments, notifications) => {
    installments.forEach((item) => {
      const toDay = new Date();
      let dateOfTerm = new Date();
      let dif = 0;
      const percentage = (parseInt(item.progress) / parseInt(item.money)) * 100;
      const roundedPerc = percentage.toFixed(2);

      dateOfTerm.setDate(28);
      if (dateOfTerm < toDay) {
        dateOfTerm.setMonth(toDay.getMonth() + 1);
      }
      dif = Math.floor((dateOfTerm - toDay) / (1000 * 60 * 60 * 24));

      const dateNoti = toDay.toLocaleDateString();

      const checkIfAlreadyPushNotification =
        notifications.length > 0
          ? notifications.find((n) => {
              return n.dateNoti == dateNoti;
            })
          : false;
      if (!checkIfAlreadyPushNotification) {
        if (dif === 3 || (dif === 2) | (dif === 1)) {
          pushNotifications(
            "Thông báo về khoản trả góp",
            `khoản trả góp ${
              item.name
            } kì hạn  ${dateOfTerm.getMonth()}/${dateOfTerm.getFullYear()} cần phải hoàn thành trong ${dif} ngày nữa.`,
            dateNoti,
            "installment"
          );
        }
        if (roundedPerc == 100) {
          pushNotifications(
            "Thông báo về hóa đơn định kì",
            `khoản trả góp ${item.name} đã hoàn thành hãy hoàn tất.`,
            dateNoti,
            "installment"
          );
        }
      }
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await client.getUserDetails();
      const usersList = await getUsersList();

      if (usersList) {
        if (usersList.find((item) => item.email === user.email)) {
        } else {
          await handleAddNewUser(
            user.given_name,
            user.family_name,
            user.email,
            user.picture
          );
        }
      } else {
        await handleAddNewUser(
          user.given_name,
          user.family_name,
          user.email,
          user.picture
        );
      }
    };

    fetchUserData();
  }, []);

  // use to check user is already or not logged in
  const checkUserAuth = async () => {
    try {
      const result = await services.getData("login");
      if (result !== "true") {
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error in checkUserAuth:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    checkUserAuth();
  }, []);

  const getBudgetPlans = async () => {
    try {
      const user = await client.getUserDetails();
      let { data, error } = await supabase
        .from("BudgetPlans")
        .select("*")
        .eq("created_by", user.email);
      if (error) {
        console.log(error);
      }
      services.storeObjectData("BudgetPlans", data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getPeriodicInvoices = async () => {
    try {
      const user = await client.getUserDetails();
      let { data, error } = await supabase
        .from("PeriodicInvoices")
        .select("*")
        .eq("created_by", user.email);
      if (error) {
        console.log(error);
      }
      services.storeObjectData("PeriodicInvoices", data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getInstallments = async () => {
    try {
      const user = await client.getUserDetails();
      let { data, error } = await supabase
        .from("Installments")
        .select("*")
        .eq("created_by", user.email);
      if (error) {
        console.log(error);
      }
      services.storeObjectData("Installments", data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getNotifications = async () => {
    try {
      const user = await client.getUserDetails();
      let { data, error } = await supabase
        .from("Notifications")
        .select("*")
        .eq("forUser", user.email);
      if (error) {
        console.log(error);
      }
      services.storeObjectData("Notifications", data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  //handle auto add notification for periodic budget plan
  useEffect(() => {
    const fetchBudgetPlans = async () => {
      try {
        const budgetPlans = await getBudgetPlans();
        const notifications = await getNotifications();
        if (budgetPlans) {
          AutoAddNotificationsForBudgetPlans(budgetPlans, notifications);
        }
      } catch (error) {}
    };

    fetchBudgetPlans();
  }, []);

  //handle auto add notification for periodic invoice
  useEffect(() => {
    const fetchPeriodicInvoices = async () => {
      try {
        const periodicInvoices = await getPeriodicInvoices();
        const notifications = await getNotifications();
        if (periodicInvoices) {
          AutoAddNotificationsForPeriodicInvoices(
            periodicInvoices,
            notifications
          );
        }
      } catch (error) {}
    };

    fetchPeriodicInvoices();
  }, []);

  //handle auto add notification for installment
  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        const installments = await getInstallments();
        const notifications = await getNotifications();
        if (installments) {
          AutoAddNotificationsForInstallments(installments, notifications);
        }
      } catch (error) {}
    };

    fetchInstallments();
  }, []);

  //handle auto delete notifications when timeout
  useEffect(() => {
    const autoDeleteNotifications = async () => {
      const toDay = new Date();
      const notifications = await getNotifications();
      notifications.forEach(async (item) => {
        const itemDate = new Date(item.created_at);
        if (toDay.getDate() - toDay.getDate() > 30) {
          const { error } = await supabase
            .from("PeriodicInvoices")
            .delete()
            .eq("id", item.id);
          if (error) console.error(error);
        }
      });
    };
    autoDeleteNotifications();
  }, []);


  return (
    <View style={{ flex: 1 }}>
      <View>
        <Header />
        <CircularChart />
        <Text style={styles.label}>Danh sách khoản chi</Text>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <CategoriesList categoriesList={categoriesList} />
        </ScrollView>
      </View>
      <View style={styles.addBtnContainer}>
        <Link href="/add-new-category">
          <Ionicons name="add-circle" size={64} color={Colors.PRIMARYA} />
        </Link>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  addBtnContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    padding: 0,
    borderRadius: 50,
  },
  label: {
    fontFamily: "ab",
    fontSize: 20,
    marginTop: 20,
    marginLeft: 20,
  },
  scrollContainer: {
    height: "50%",
  },
});
