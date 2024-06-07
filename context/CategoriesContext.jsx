import React, { createContext, useState, useEffect } from 'react';
import { getCategoriesList } from '../utils/Supabase'; // Ensure this path is correct

export const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categoriesList, setCategoriesList] = useState([]);

  const fetchCategories = async () => {
    const categories = await getCategoriesList();
    setCategoriesList(categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categoriesList, fetchCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
};
