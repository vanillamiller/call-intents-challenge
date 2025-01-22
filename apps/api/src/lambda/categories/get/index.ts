// src/lambda/categories/get/index.ts
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { getAllCategories } from "../../../intents-client";

export const handler = async (): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const categoriesWithCount = await getAllCategories();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoriesWithCount),
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
