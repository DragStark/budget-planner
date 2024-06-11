import React, { createContext, useState, useEffect } from "react";
import {
  getCategoriesList,
  getParentTags,
  getTagsList,
  getExpenseItems
} from "../utils/Supabase"; // Ensure this path is correct

export const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [parentTagsList, setParentTagsList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [expenseItems, setExpenseItems] = useState([]);

  const fetchCategories = async () => {
    const categories = await getCategoriesList();
    setCategoriesList(categories);
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
    setExpenseItems(expenseItems);
  };

  useEffect(() => {
    fetchCategories();
    fetchParentTags();
    fetchTagsList();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{ categoriesList, fetchCategories, fetchExpenseItems, parentTagsList, tagsList, expenseItems }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
