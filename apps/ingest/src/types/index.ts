import { zodResponseFormat } from "openai/helpers/zod";

export interface Prompt {
    role: "system" | "assistant" | "user";
    content: string;
}

export type PromptList = Prompt[];

export interface CompletionParams {
    id: string;
    model: string;
    temperature: number;
    responseFormat?: ReturnType<typeof zodResponseFormat>
    prompts: PromptList;
};

export interface CompletedCompletion {
    completion: string;
    success: boolean;
}