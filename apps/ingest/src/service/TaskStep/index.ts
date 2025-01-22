import { CompletionParamsList, PromptsCompletionMap } from "src/types";

export type ValidateFn = (completion: PromptsCompletionMap) => boolean;
export type PrepareFn = <T>(raw: T) => CompletionParamsList;
export type ExecuteFn = (requetedCompletion: CompletionParamsList) => Promise<PromptsCompletionMap>;
export type NewRequestFromCompletionFn = (completion: PromptsCompletionMap) => CompletionParamsList;

interface TaskStepParams {
  validate?: ValidateFn;
  onInvalid?: ExecuteFn;
  prepare?: PrepareFn;
  execute: ExecuteFn;
  returnPrompt?: NewRequestFromCompletionFn;
}

class TaskStep {
  private validate: ValidateFn | undefined;
  private onInvalidReprompt: ExecuteFn | undefined;
  private prepare: PrepareFn | undefined;
  private execute: ExecuteFn;
  private _result: PromptsCompletionMap;
  private requestedCompletions: CompletionParamsList;
  private preparedRequests: CompletionParamsList;
  public returnPrompt: NewRequestFromCompletionFn | undefined;

  constructor({ validate, prepare, returnPrompt, execute, onInvalid }: TaskStepParams) {
    this.validate = validate;
    this.onInvalidReprompt = onInvalid;
    this.returnPrompt = returnPrompt;
    this.prepare = prepare;
    this._result = {};
    this.requestedCompletions = [];
    this.preparedRequests = [];
    this.execute = execute;
  }

  public executeTask = async (requesedCompletions: CompletionParamsList) => {
    this.requestedCompletions = requesedCompletions;
    this.preparedRequests = this.prepare?.(requesedCompletions) ?? requesedCompletions;

    const result = await this.execute(this.preparedRequests);
    if (this.validate) {
      const isValid = this.validate(result);
      // eslint-disable-next-line no-empty
      while (!isValid) {}
    }
    this._result = result;
    return this.returnPrompt?.(result);
  };

  get requested() {
    return this.requestedCompletions;
  }

  get prepared() {
    return this.preparedRequests;
  }

  get result() {
    return this._result;
  }
}

export default TaskStep;
