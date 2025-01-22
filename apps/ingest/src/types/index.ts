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
  responseFormat?: ReturnType<typeof zodResponseFormat>;
  prompts: PromptList;
}
export type CompletionParamsList = CompletionParams[];
export interface CompletedCompletion {
  prompts: PromptList;
  completion: string;
  success: boolean;
}

export type PromptsCompletionMap = Record<string, CompletedCompletion>;
