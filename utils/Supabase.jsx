
import { createClient } from '@supabase/supabase-js'
import { client } from './KindeConfig'
import services from './services'

const supabaseUrl = 'https://ivoqqxsmswfdokxfuqee.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2b3FxeHNtc3dmZG9reGZ1cWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2NzUwOTEsImV4cCI6MjAzMzI1MTA5MX0.bF6N4aBQVykC7N1ai5z6cNyU00LDvTPALeMUuqkK7t4'
const supabase = createClient(supabaseUrl, supabaseKey)

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
      services.storeObjectData('categories', data);
      return data; // Return the fetched data
    } catch (error) {
      console.error("Error in getCategoriesList:", error);
      return []; // Return an empty array in case of error
    }
  };
  


export default supabase;