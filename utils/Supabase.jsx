import { createClient } from "@supabase/supabase-js";
import { client } from "./KindeConfig";
import services from "./services";

const supabaseUrl = "https://ivoqqxsmswfdokxfuqee.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2b3FxeHNtc3dmZG9reGZ1cWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2NzUwOTEsImV4cCI6MjAzMzI1MTA5MX0.bF6N4aBQVykC7N1ai5z6cNyU00LDvTPALeMUuqkK7t4";
const supabase = createClient(supabaseUrl, supabaseKey);

export const getCategoriesList = async () => {
  try {
    const user = await client.getUserDetails();
    const { data, error } = await supabase
      .from("Categories")
      .select("*, CategoryItems(*)")
      .eq("created_by", user.email);
    if (error) {
      throw error;
    }
    services.storeObjectData("categories", data);
    return data; // Return the fetched data
  } catch (error) {
    console.error("Error in getCategoriesList:", error);
    return []; // Return an empty array in case of error
  }
};


export const getParentTags = async () => {
  try {
    let { data, error } = await supabase.from("ParrentTags").select("*");
    if (error) {
      throw error;
    }
    services.storeObjectData("parentTags", data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getTagsList = async () => {
  try {
    let { data, error } = await supabase.from("Tags").select("*");
    if (error) {
      throw error;
    }
    services.storeObjectData("Tags", data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getExpenseItems = async () => {
  try {
    const user = await client.getUserDetails();
    let { data, error } = await supabase
      .from("ExpenseItems")
      .select("*")
      .eq("created_by", user.email);
    if (error) {
      console.log(error);
    }
    services.storeObjectData("ExpenseItems", data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getBudgetPlans = async () => {
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

export const getInstallments = async () => {
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

export const getPeriodicInvoices = async () => {
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

export const getUsersList = async () => {
  try {
    const user = await client.getUserDetails();
    let { data, error } = await supabase
      .from("Users")
      .select("*")
    if (error) {
      console.log(error);
    }
    services.storeObjectData("Users", data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getFamilyPlan = async () => {
  try {
    const user = await client.getUserDetails();
    let { data, error } = await supabase
      .from("FamilyPlans")
      .select("*")
      .eq("owner", user.email)
    if (error) {
      console.log(error);
    }
    services.storeObjectData("FamilyPlans", data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getNotifications = async () => {
  try {
    const user = await client.getUserDetails();
    let { data, error } = await supabase
      .from("Notifications")
      .select("*")
      .eq("forUser", user.email)
    if (error) {
      console.log(error);
    }
    services.storeObjectData("Notifications", data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default supabase;
