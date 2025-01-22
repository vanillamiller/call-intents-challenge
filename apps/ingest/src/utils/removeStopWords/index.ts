import { removeStopwords } from "stopword";

export const removeStopWordsString = (word: string) => removeStopwords(word.split(" ")).join(" ");
