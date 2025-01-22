// src/lambda/categories/get-by-id/index.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { getCategoryById } from "../../../intents-client";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const id = event.pathParameters?.id;

    if (!id || isNaN(Number(id))) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Invalid ID provided" }),
      };
    }

    const category = await getCategoryById(id);

    if (!category) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Category not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    };
  } catch (error) {
    console.error("Error fetching category:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
