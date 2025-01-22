import { PrismaClient } from "@amiller/prisma";
import { chunk } from "lodash";

interface IntentData {
  category: string;
  intents: string[];
}

const prisma = new PrismaClient();
const CHUNK_SIZE = 1;

export const deleteAllData = async () => {
  try {
    console.log("Deleting all data...");

    // Delete data in child table first
    await prisma.intent.deleteMany();
    console.log("All intents deleted.");

    // Then delete data in the parent table
    await prisma.intentCategory.deleteMany();
    console.log("All intent categories deleted.");

    console.log("All data deleted successfully.");
  } catch (error) {
    console.error("Error deleting data:", error);
  } finally {
    await prisma.$disconnect();
  }
};

const createIntentsWithCategory = async (data: IntentData) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const category = await tx.intentCategory.upsert({
        where: { name: data.category },
        update: {},
        create: { name: data.category },
      });

      console.info("category created", result);
      const intents = await tx.intent.createMany({
        data: data.intents.map((intent) => ({
          intent,
          intentCategoryId: category.id,
        })),
      });
      console.info("intents created", result);
      return { category, intentsCreated: intents.count };
    });

    return result;
  } catch (error) {
    console.error("Error creating intents:", error);
    console.error("Data causing error:", data);
    throw error;
  }
};

export const createMultipleCategories = async (dataArray: IntentData[]) => {
  try {
    const chunks = chunk(dataArray, CHUNK_SIZE);

    const results = [];
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(chunk.map((data) => createIntentsWithCategory(data)));
      results.push(...chunkResults);
    }

    return results;
  } finally {
    await prisma.$disconnect();
  }
};
