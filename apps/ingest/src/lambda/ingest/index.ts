import { S3Event, Context } from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import prisma from "../../lib/prisma";

const s3Client = new S3Client({});

export const handler = async (event: S3Event, context: Context): Promise<void> => {
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
            const content = await response.Body?.transformToString();
            console.log(content);


        } catch (error) {
            console.error(`Failed to retrieve object ${objectKey} from bucket ${bucketName}:`, error);
        }
    }
};