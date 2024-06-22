import React, { createContext, useState, useEffect } from "react";
import {
  getCategoriesList,
  getParentTags,
  getTagsList,
  getExpenseItems,
  getBudgetPlans,
  getInstallments,
  getPeriodicInvoices,
  getUsersList,
  getFamilyPlan,
  getNotifications,
} from "../utils/Supabase"; // Ensure this path is correct

export const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [parentTagsList, setParentTagsList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [expenseItems, setExpenseItems] = useState([]);
  const [budgetPlans, setBudgetPlans] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [periodicInvoices, setPeriodicInvoices] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [familyPlan, setFamilyPlan] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const fetchCategories = async () => {
    const categories = await getCategoriesList();
    setCategoriesList(categories.reverse());
  };

  const fetchParentTags = async () => {
    const parentTags = await getParentTags();
    setParentTagsList(parentTags);
  };
  const fetchTagsList = async () => {
    const tagsList = await getTagsList();
    setTagsList(tagsList);
  };
  const fetchExpenseItems = async () => {
    const expenseItems = await getExpenseItems();
    setExpenseItems(expenseItems.reverse());
  };

  const fetchBudgetPlans = async () => {
    const budgetPlans = await getBudgetPlans();
    setBudgetPlans(budgetPlans.reverse());
  };

  const fetchInstallments = async () => {
    const installments = await getInstallments();
    setInstallments(installments.reverse());
  };

  const fetchPeriodicInvoices = async () => {
    const periodicInvoices = await getPeriodicInvoices();
    setPeriodicInvoices(periodicInvoices.reverse());
  };

  const fetchUsersList = async () => {
    const usersList = await getUsersList();
    setUsersList(usersList.reverse());
  };

  const fetchFamilyPlan = async () => {
    const FamilyPlan = await getFamilyPlan();
    setFamilyPlan(FamilyPlan.reverse());
  };

  const fetchNotifications = async () => {
    const notifications = await getNotifications();
    setNotifications(notifications.reverse());
  };

  useEffect(() => {
    fetchCategories();
    fetchParentTags();
    fetchTagsList();
    fetchBudgetPlans();
    fetchInstallments();
    fetchPeriodicInvoices();
    fetchFamilyPlan();
    fetchNotifications();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categoriesList,
        fetchCategories,
        expenseItems,
        fetchExpenseItems,
        parentTagsList,
        tagsList,
        budgetPlans,
        fetchBudgetPlans,
        installments,
        fetchInstallments,
        periodicInvoices,
        fetchPeriodicInvoices,
        usersList,
        fetchUsersList,
        familyPlan,
        fetchFamilyPlan,
        notifications,
        fetchNotifications,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
