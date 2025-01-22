import Axios from "axios";
import { IntentsApiResponse } from "../types/intent";

const intentsClient = Axios.create({
  baseURL: `https://${import.meta.env.VITE_API_DOMAIN}/dev`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCategories = async () => {
  try {
    const { data } = await intentsClient.get("/categories");
    return data;
  } catch (error) {
    console.error("getCategories", error);
    throw error;
  }
};

export const getCategoryIntents = async (categoryId?: number): Promise<IntentsApiResponse> => {
  try {
    const { data } = await intentsClient.get(`categories/${categoryId}`);
    return data;
  } catch (error) {
    console.error("getCategoryIntents", error);
    throw error;
  }
};
