import { S3Event, Context } from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import Inference from "src/service";
import { removeStopWordsString } from "src/utils/removeStopWords";
import { chunk } from "lodash"
import { CompletionParams } from "src/types";
import { nanoid } from "nanoid";
import { FIRST_PASS_FEW_SHOT } from "src/constants/system-prompts";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const s3Client = new S3Client({});

type Params = {
    model: string;
    temperature: number;
    systemPrompt: string;
    responseFormat?: {
        format: z.ZodType;
        name: string
    }
}
class CompletionParamFactory<T> {
    private model: string;
    private temperature: number;
    private systemPrompt: string;
    private responseFormat: ReturnType<typeof zodResponseFormat> | undefined;
    constructor({ model, temperature, systemPrompt, responseFormat }: Params) {
        this.model = model;
        this.temperature = temperature;
        this.systemPrompt = systemPrompt;
        this.responseFormat = responseFormat ? zodResponseFormat(responseFormat.format, responseFormat.name) : undefined;
    }

    public create(prompts: string[]): CompletionParams {
        return {
            id: nanoid(),
            model: this.model,
            temperature: this.temperature,
            responseFormat: this.responseFormat,
            prompts: [
                { role: "system", content: this.systemPrompt },
                ...prompts.map((prompt) => ({ role: "user" as const, content: prompt }))
            ]
        }
    }
}

export const handler = async (event: S3Event): Promise<void> => {
    for (const record of event.Records) {
        const bucketName = record.s3.bucket.name;
        const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

        console.log(`Bucket: ${bucketName}, Key: ${objectKey}`);

        try {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: objectKey,
            });

            const response = await s3Client.send(command);
            const content = await response.Body?.transformToString();
            console.log(content);

            const intents = content?.split("\n") ?? [];
            const parsedIntents = intents.map((ri) => removeStopWordsString(ri));
            const firstPassPromptFactory = new CompletionParamFactory({
                model: "gpt-4o-mini",
                temperature: 0.01,
                systemPrompt: FIRST_PASS_FEW_SHOT,
                responseFormat: {
                    format: z.object({
                        simplifiedIntents: z.array(z.string())
                    }),
                    name: "simplified_intents"
                }
            });

            const firstPassPrompts = chunk(parsedIntents, 20).map((prompts) => firstPassPromptFactory.create(prompts))
            const inference = new Inference(firstPassPrompts);
            const completions = await inference.completeTaskConcurrent();
            
            
            console.log(`COMPLETIONS`,completions.flat());


        } catch (error) {
            console.error(`Failed to retrieve object ${objectKey} from bucket ${bucketName}:`, error);
        }
    }
};