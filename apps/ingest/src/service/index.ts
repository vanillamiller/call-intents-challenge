import openai from "../lib/openai";
import { CompletedCompletion, CompletionParams } from "../types";

class Inference {
    private openai = openai;
    private requestedCompletions: Record<string, CompletionParams> = {};
    private completedCompletions: Record<string, CompletedCompletion> = {};

    constructor(rCompletions: CompletionParams[]) {
        this.requestedCompletions = rCompletions.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {})
    }

    public async complete({ temperature, model, responseFormat, prompts }: CompletionParams) {
        try {
            console.log("PROMPTS", prompts);
            const completion = await this.openai.chat.completions.create({
                model,
                temperature,
                messages: prompts,
                response_format: responseFormat
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.log("ERROR Inference.complete", error)
            throw error;
        }
    }

    public async completeTaskConcurrent() {
        const completions = await Promise.allSettled(Object.entries(this.requestedCompletions).map(async ([key, val]) => {
            let retries = 5;
            while (!this.completedCompletions[key]?.success && retries) {
                try {
                    const completion = await this.complete(val);
                    if (!completion) {
                        throw new Error(`Failed to complete task ${key}`);
                    }
                    this.completedCompletions[key] = { completion, success: true, prompts: val.prompts };
                    console.log("COMPLETION", completion);
                    return completion;
                } catch (error) {
                    if(!(--retries)){
                        throw error;
                    };
                }
            }
        }));
        return completions;
    }

    get completed() {
        return this.completedCompletions;
    }

    get requested() {
        return this.requestedCompletions;
    }

}

export default Inference;