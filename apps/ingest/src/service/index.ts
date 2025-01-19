import openai from "../lib/openai";


class IntentCateorizer {
    private openai: typeof openai;
    constructor() {
        this.openai = openai;
    }
}

export default IntentCateorizer;