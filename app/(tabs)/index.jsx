import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import services from "../../utils/services";
import { client } from "@/utils/KindeConfig";
import { Colors } from "@/constants/Colors";
import { CategoriesContext } from "../../context/CategoriesContext";
import supabase from "../../utils/Supabase";
import Header from "../../components/Header";
import CircularChart from "../../components/CircularChart";
import CompareChart from "../../components/CompareChart";
import Tag from "../../components/TagDisplayIcon/Tag";

const Home = () => {
  const {
    expenseItems,
    fetchExpenseItems,
    budgetPlans,
    installments,
    periodicInvoices,
    familyPlan,
    fetchBudgetPlans,
    fetchInstallments,
    fetchCategories,
    fetchPeriodicInvoices,
  } = useContext(CategoriesContext);

  const filteredByTimeOption = () => {
    let filteredItems = [];
    const currDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currDate.getDate() - 30);
    filteredItems = expenseItems.filter(
      (item) => new Date(item.time) > pastDate
    );
    if (filteredItems)
      filteredItems.sort((a, b) => new Date(a.time) - new Date(b.time));
    return filteredItems;
  };

  useEffect(() => {
    fetchExpenseItems();
  }, []);

  const totalExpense = () => {
    let total = 0;
    filteredByTimeOption().forEach((item) => {
      if (item.type === "expense") total += item.money;
    });
    return total;
  };

  const totalIncome = () => {
    let total = 0;
    filteredByTimeOption().forEach((item) => {
      if (item.type === "income") total += item.money;
    });
    return total;
  };

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

  const { notifications, fetchNotifications } = useContext(CategoriesContext);

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
          ? dateEnd.getDate() - toDay.getDate()
          : 100;

      const percentage = (parseInt(item.progress) / parseInt(item.money)) * 100;
      const roundedPerc = percentage.toFixed(2);
      dateNoti = toDay.toLocaleDateString();
      const checkIfAlreadyPushNotification =
        notifications.length > 0
          ? notifications.find((n) => {
              return (
                n.dateNoti == dateNoti &&
                n.detail.includes(
                  `chúc mừng, kế hoạch ${item.name} đạt ${roundedPerc}%`
                )
              );
            })
          : false;

      if (!checkIfAlreadyPushNotification) {
        if (dif === 3 || dif === 2 || dif === 1) {
          pushNotifications(
            "Thông báo về Kế hoạch chi tiêu",
            `kế hoạch ${item.name} đã đạt ${roundedPerc}% và sẽ kết thúc trong ${dif} ngày nữa.`,
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
            `chúc mừng, kế hoạch ${item.name} đạt ${roundedPerc}%`,
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
      let dateStart = new Date(item.dateStart);
      let dateEnd = new Date(item.dateEnd);

      if (toDay >= dateStart && toDay <= dateEnd) {
        let dif = 0;
        const percentage =
          (parseInt(item.progress) / parseInt(item.money)) * 100;
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
      }
    });
  };

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

  useEffect(() => {
    checkUserAuth();
    fetchBudgetPlans();
    fetchInstallments();
    fetchCategories();
    fetchPeriodicInvoices();
    fetchNotifications();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Header />
        <ScrollView style={{ height: 680 }}>
          <CircularChart title={true} />
          <View style={styles.chartDeck}>
            <View style={styles.chartTitleContainer}>
              <Text style={styles.chartTitleLabel}>
                Tình hình thu chi tháng này{" "}
              </Text>
              <TouchableOpacity onPress={() => router.replace("tracking")}>
                <Text style={styles.chartTitleDetail}>Chi tiết</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.compareContainer}>
              <View style={styles.chartContainer}>
                <CompareChart expense={totalExpense()} income={totalIncome()} />
              </View>
              <View style={styles.chartInfoContainer}>
                <Text style={[styles.chartInfoText, { color: Colors.INCOME }]}>
                  {totalIncome()}đ
                </Text>
                <Text style={[styles.chartInfoText, { color: Colors.EXPENSE }]}>
                  {totalExpense()}đ
                </Text>
                <View style={{ borderTopWidth: 2, paddingTop: 10 }}>
                  <Text
                    style={[
                      styles.chartInfoText,
                      { color: Colors.categories.b },
                    ]}
                  >
                    {totalIncome() - totalExpense()}đ
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                gap: 20,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: Colors.INCOME,
                  fontFamily: "ab",
                  fontSize: 16,
                }}
              >
                Thu vào
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: Colors.EXPENSE,
                  fontFamily: "ab",
                  fontSize: 16,
                }}
              >
                Chi ra
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: Colors.categories.b,
                  fontFamily: "ab",
                  fontSize: 16,
                }}
              >
                Chênh lệch
              </Text>
            </View>
          </View>
          <View style={styles.itemContainer}>
            <View style={styles.chartTitleContainer}>
              <Text style={styles.chartTitleLabel}>Kế hoạch chi tiêu</Text>
              <TouchableOpacity
                onPress={() => router.replace("/save-plan/budget-plan")}
              >
                <Text style={styles.chartTitleDetail}>Chi tiết</Text>
              </TouchableOpacity>
            </View>
            <Text>Bạn đang có {budgetPlans.length} kế hoạch</Text>
          </View>
          <View style={styles.itemContainer}>
            <View style={styles.chartTitleContainer}>
              <Text style={styles.chartTitleLabel}>Khoản trả góp</Text>
              <TouchableOpacity
                onPress={() => router.replace("/save-plan/installment")}
              >
                <Text style={styles.chartTitleDetail}>Chi tiết</Text>
              </TouchableOpacity>
            </View>
            <Text>Bạn đang có {installments.length} khoản trả góp</Text>
          </View>
          <View style={styles.itemContainer}>
            <View style={styles.chartTitleContainer}>
              <Text style={styles.chartTitleLabel}>hóa đơn định kì</Text>
              <TouchableOpacity
                onPress={() => router.replace("/save-plan/periodic-invoices")}
              >
                <Text style={styles.chartTitleDetail}>Chi tiết</Text>
              </TouchableOpacity>
            </View>
            <Text>Bạn đang có {periodicInvoices.length} hóa đơn</Text>
          </View>
          <View style={styles.itemContainer}>
            <View style={styles.chartTitleContainer}>
              <Text style={styles.chartTitleLabel}>Sổ chi tiêu gia đình</Text>
              <TouchableOpacity
                onPress={() => router.replace("/save-plan/family-plan")}
              >
                <Text style={styles.chartTitleDetail}>Chi tiết</Text>
              </TouchableOpacity>
            </View>
            <Text>sổ chi tiêu gia đình có {familyPlan.length} thành viên</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  btn: {
    height: 60,
    width: 200,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARYA,
  },
  btnLabel: {
    fontSize: 16,
    fontFamily: "ab",
    color: "white",
  },
  chartDeck: {
    margin: 20,
    backgroundColor: "white",
    height: 250,
    padding: 20,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  itemContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 10,
  },
  chartTitleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chartTitleLabel: {
    fontSize: 16,
    fontFamily: "asb",
  },
  chartTitleDetail: {
    fontSize: 16,
    fontFamily: "asb",
    color: Colors.categories.c,
  },
  compareContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 30,
    justifyContent: "space-between",
  },
  chartContainer: {
    height: 100,
  },
  chartInfoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  chartInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
  },
  chartInfoText: {
    fontSize: 16,
    fontFamily: "rsb",
  },
});
