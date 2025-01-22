import { nanoid } from "nanoid";
import { zodResponseFormat } from "openai/helpers/zod";
import { CompletionParams } from "src/types";
import { z } from "zod";

type Params = {
  model: string;
  temperature: number;
  systemPrompt: string;
  responseFormat?: {
    format: z.ZodType;
    name: string;
  };
};
class CompletionParamFactory {
  private model: string;
  private temperature: number;
  private systemPrompt: string;
  private responseFormat: ReturnType<typeof zodResponseFormat> | undefined;
  constructor({ model, temperature, systemPrompt, responseFormat }: Params) {
    this.model = model;
    this.temperature = temperature;
    this.systemPrompt = systemPrompt;
    this.responseFormat = responseFormat
      ? zodResponseFormat(responseFormat.format, responseFormat.name)
      : undefined;
  }

  public create(prompts: string[]): CompletionParams {
    return {
      id: nanoid(),
      model: this.model,
      temperature: this.temperature,
      responseFormat: this.responseFormat,
      prompts: [
        { role: "system", content: this.systemPrompt },
        ...prompts.map((prompt) => ({ role: "user" as const, content: prompt })),
      ],
    };
  }
}

export default CompletionParamFactory;
