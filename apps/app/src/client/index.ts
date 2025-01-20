import Axios from "axios";

const intentsClient = Axios.create({
  baseURL: `https://${import.meta.env.VITE_API_DOMAIN}/dev`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getCategories = async () => {
  try {
    const { data } = await intentsClient.get("/categories");
    return data;
  } catch (error) {
    console.error("getCategories", error);
    throw error;
  }
}

export const getCategoryIntents = async (categoryId: number) => {
  try {
    const { data } = await intentsClient.get(`categories/${categoryId}`);
    return data;
  } catch(error) {
    console.error("getCategoryIntents", error);
    throw error;
  }
}
