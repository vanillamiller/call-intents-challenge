import { PromptsCompletionMap } from "src/types";
import TaskStep from "../TaskStep";
import Inference from "../Inference";
import CompletionParamFactory from "../CompletionParamFactory";
import {
  FIRST_PASS_FEW_SHOT,
  LIST_RESPONSE_FORMAT,
  SECOND_PASS_FEW_SHOT,
  THIRD_PASS_CLASSIFY,
} from "src/constants/prompts";
import { removeStopWordsString } from "src/utils/removeStopWords";
import { nanoid } from "nanoid";
import { chunk } from "lodash";

interface Intent {
  id: string;
  intent: string;
  parsedIntent?: string;
  category?: string;
}

const CHUNK_SIZE = 30;

class IntentCategorizer {
  private steps: TaskStep[] = [];
  private intentsMap: Record<string, Intent> = {};
  private results: PromptsCompletionMap[] = [];

  constructor(intents: string[]) {
    for (const intent of intents) {
      const id = nanoid();
      this.intentsMap[id] = { intent, id };
    }

    const firstPass = new TaskStep({
      execute: async (requests) => {
        const inference = new Inference(requests);
        const result = await inference.completeConcurrent();
        this.results.push(result);
        return result;
      },
      returnPrompt: (map) => {
        const firstPassCats = new Set<string>();
        for (const obj of Object.values(map)) {
          const { completion } = obj;
          for (const category of Object.values(JSON.parse(completion))) {
            firstPassCats.add(category as string);
          }
        }
        const factory = new CompletionParamFactory({
          model: "gpt-4o-mini",
          temperature: 0.01,
          systemPrompt: SECOND_PASS_FEW_SHOT,
          responseFormat: LIST_RESPONSE_FORMAT,
        });
        const prompts = factory.create([JSON.stringify(Array.from(firstPassCats))]);
        return [prompts];
      },
    });

    const secondPass = new TaskStep({
      execute: async (requests) => {
        const inference = new Inference(requests);
        const result = await inference.completeConcurrent();
        this.results.push(result);
        console.log("SECOND PASS RESULT", result);
        return result;
      },
      returnPrompt: (map) => {
        let secondPassCatsList: string[] = [];
        for (const obj of Object.values(map)) {
          const { completion } = obj;
          const { listResponse } = JSON.parse(completion);
          secondPassCatsList = [...secondPassCatsList, ...listResponse];
        }
        const secondPassCatSet = new Set(secondPassCatsList);
        const factory = new CompletionParamFactory({
          model: "gpt-4o-mini",
          temperature: 0.01,
          systemPrompt: THIRD_PASS_CLASSIFY(Array.from(secondPassCatSet)),
        });
        const intentList = Object.entries(this.intentsMap).map(([_, vals]) => vals);
        const chunks = chunk(intentList, CHUNK_SIZE);
        const messages = chunks.map((chunk) =>
          chunk.reduce(
            (acc, { id, parsedIntent }) => ({
              ...acc,
              [id]: parsedIntent,
            }),
            {}
          )
        );
        const prompts = messages.map((p) => factory.create([JSON.stringify(p)]));
        return prompts;
      },
    });

    const thirdPass = new TaskStep({
      execute: async (requests) => {
        const inference = new Inference(requests);
        const result = await inference.completeConcurrent();
        console.log("THIRD PASS RESULT", result);
        this.results.push(result);
        return result;
      },
    });

    this.steps.push(firstPass);
    this.steps.push(secondPass);
    this.steps.push(thirdPass);
  }

  private prepareRawIntents(rawIntents: Record<string, Intent>, systemPrompt: string) {
    for (const [key, val] of Object.entries(rawIntents)) {
      const parsedIntent = removeStopWordsString(val.intent);
      this.intentsMap[key] = { ...val, parsedIntent, id: key };
    }
    const intentList = Object.entries(this.intentsMap).map(([_, vals]) => vals);
    const factory = new CompletionParamFactory({
      model: "gpt-4o-mini",
      temperature: 0.01,
      systemPrompt: systemPrompt,
    });

    const chunks = chunk(intentList, CHUNK_SIZE);
    const messages = chunks.map((chunk) =>
      chunk.reduce(
        (acc, { id, parsedIntent }) => ({
          ...acc,
          [id]: parsedIntent,
        }),
        {}
      )
    );
    const prompts = messages.map((p) => factory.create([JSON.stringify(p)]));
    return prompts;
  }

  private async runTasks(): Promise<PromptsCompletionMap[]> {
    let prompt = this.prepareRawIntents(this.intentsMap, FIRST_PASS_FEW_SHOT);
    for (const { executeTask } of this.steps) {
      prompt = (await executeTask(prompt)) ?? [];
    }
    return this.steps.map((s) => s.result);
  }

  public catagorizeIntents = async () => {
    const tasksResults = await this.runTasks();
    const final = tasksResults.at(-1);
    if (!final) {
      return;
    }
    for (const { completion: rawCompletion } of Object.values(final)) {
      const completion = JSON.parse(rawCompletion);
      for (const [id, category] of Object.entries(completion)) {
        this.intentsMap[id].category = category as string;
      }
    }
    return Object.values(this.intentsMap).map(({ id, intent, category }) => ({
      id,
      intent,
      category,
    }));
  };
}

export default IntentCategorizer;
