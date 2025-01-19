import { S3Event, Context } from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { PrismaClient } from "@amiller/prisma"
// Helper function to convert a readable stream to a string
const streamToString = (stream: Readable): Promise<string> =>
    new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });

const s3Client = new S3Client({});
const prisma = new PrismaClient();

export const handler = async (): Promise<void> => {
    // console.log("Received S3 Event:", JSON.stringify(event, null, 2));
    const results = await prisma.intentCategory.count();
    console.log("Results:", results);
    for (const record of event.Records) {
        const bucketName = record.s3.bucket.name;
        const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

        console.log(`Bucket: ${bucketName}, Key: ${objectKey}`);

        try {
            // Get the object from S3
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: objectKey,
            });

            const response = await s3Client.send(command);

            if (response.Body instanceof Readable) {
                const content = await streamToString(response.Body);
                console.log(`Object Content: ${content.slice(0, 100)}...`);
            } else {
                console.log("Response body is not a readable stream.");
            }
        } catch (error) {
            console.error(`Failed to retrieve object ${objectKey} from bucket ${bucketName}:`, error);
        }
    }
};

handler();