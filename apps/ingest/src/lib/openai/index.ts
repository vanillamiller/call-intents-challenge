import OpenAI from "openai";
import { zodResponseFormat as zrf } from "openai/helpers/zod";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const zodResponseFormat = zrf;
export default openai;