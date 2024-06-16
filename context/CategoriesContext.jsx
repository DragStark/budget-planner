import React, { createContext, useState, useEffect } from "react";
import {
  getCategoriesList,
  getParentTags,
  getTagsList,
  getExpenseItems,
  getBudgetPlans,
  getInstallments,
} from "../utils/Supabase"; // Ensure this path is correct

export const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [parentTagsList, setParentTagsList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [expenseItems, setExpenseItems] = useState([]);
  const [budgetPlans, setBudgetPlans] = useState([]);
  const [installments, setInstallments] = useState([]);

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

  useEffect(() => {
    fetchCategories();
    fetchParentTags();
    fetchTagsList();
    fetchBudgetPlans();
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
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
