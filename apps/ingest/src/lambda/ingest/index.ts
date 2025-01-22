import { S3Event } from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import IntentCategorizer from "src/service/IntentCategorizer";
import { createMultipleCategories, deleteAllData } from "src/lib/prisma";

const s3Client = new S3Client({});

export const handler = async (event: S3Event): Promise<void> => {
  for (const record of event.Records) {
    const bucketName = record.s3.bucket.name;
    const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
      });

      const response = await s3Client.send(command);
      const content = await response.Body?.transformToString();

      const intents = content?.split("\n") ?? [];
      const intentCategorizer = new IntentCategorizer(intents);
      const results = await intentCategorizer.catagorizeIntents();
      if (!results) {
        throw new Error("No results");
      }

      if (intents.length === results.length) {
        const structured = Array.from(
          results.reduce((map, item) => {
            if (!map.has(item.category!)) {
              map.set(item.category!, []);
            }
            map.get(item.category!)?.push(item.intent);
            return map;
          }, new Map<string, string[]>())
        ).map(([category, intents]) => ({ category, intents }));
        console.log("Structured:", structured);
        const result = await createMultipleCategories(structured);
        console.log("prisma result", result);
      } else {
        throw new Error("Results length does not match intents length!");
      }
    } catch (error) {
      console.error(`ERROR handler`, error);
      throw error;
    }
  }
};
