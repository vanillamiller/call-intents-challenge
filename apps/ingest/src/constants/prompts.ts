import { removeStopWordsString } from "src/utils/removeStopWords";
import { z } from "zod";

const rawIntentsExample: Record<string, string> = {
  "QrQ3_xyGiys9TGyVxFsO-": "Ignite international data roaming",
  "8URUqNJt3KK4qMGbB4fHd": "Demand service for broken apparatus",
  "W7U8kksHA20GZYGq85r-H": "Demand a copy of previous invoices",
  "-qoOfxPUjg3pwi5DLZn9U": "Solve a technical mystery",
  "DjPt_WbyCqTDkM48P3v-y": "Implore a temporary service interruption",
  "99Si7yFBZdwPiYOsXuMAm": "Uncover the early termination fee implications",
  u_rN4ESGIZqp7F7hpuDqo: "Spark the inquiry into acquiring a modern phone or internet offering",
  "7yBBxpE640NWUG50mv_lE": "Gather information on the data utilization and surcharge",
  "4J6gFI8anMPEJYWWcCYHE":
    "Trigger the onboarding process for a brand-new handset or internet service",
  BuuWJ5eGmIB1gIqqFVizR: "Mobilize international data usageMobilize international data usage",
};

for (const [key, val] of Object.entries(rawIntentsExample)) {
  rawIntentsExample[key] = removeStopWordsString(val);
}

const simplifiedIntentsExample = {
  "QrQ3_xyGiys9TGyVxFsO-": "Activation",
  "8URUqNJt3KK4qMGbB4fHd": "Repair",
  "W7U8kksHA20GZYGq85r-H": "Billing",
  "-qoOfxPUjg3pwi5DLZn9U": "Technical Support",
  "DjPt_WbyCqTDkM48P3v-y": "Service Termination",
  "99Si7yFBZdwPiYOsXuMAm": "Fees",
  u_rN4ESGIZqp7F7hpuDqo: "Sales",
  "7yBBxpE640NWUG50mv_lE": "Usage",
  "4J6gFI8anMPEJYWWcCYHE": "Service Connection",
  BuuWJ5eGmIB1gIqqFVizR: "Data Roaming",
};

export const FIRST_PASS_FEW_SHOT = `
Categorize caller intents coming from a helpline to a Telecommunications company.
Categories relate to customer experience in the telecommunications industry.
Do not use words "Enquiry" or "Inquiry" in the categories.
Do not use plurals in your answer.
Use 2 words maximum, prefer one word but only if it is a noun.
Use US spelling.
Use capital letters at the start of each word, and no punctuation.
You will be given a json indexed by id containing intents to categorize in which the output will be a json with
the intent category with the same index as the provided intent.
Categorize strings with undecidable intent as "Unknown" not ''.
--- EXAMPLES ---
PROMPT: ${JSON.stringify(rawIntentsExample)}
COMPLETION: ${JSON.stringify(simplifiedIntentsExample)}
`;

const rawCategories = [
  "Service Disruption",
  "Service Failure",
  "Theft",
  "Theft Report",
  "Account Access",
  "Account",
  "Offers",
  "Offering",
];
const simplifiedCategories = ["Service Disruption", "Theft", "Account", "Offers"];
export const SECOND_PASS_FEW_SHOT = `
You are tasked with simplifying customer experience categories in the Telecommunications sector.
You will be given an array of categories in which you will group similar categories to simpler ones, and remove ones
that .
Your answer should be a significantly shorter array than the one given to you.
--- EXAMPLE ---
PROMPT: ${JSON.stringify(rawCategories)}
COMPLETION: ${JSON.stringify(simplifiedCategories)}
--- EXPLANATION ---
The category "Serice Failure" was removed in favor of "Service Disruption" because it was more akin to customer experience 
terminology. The category "Theft Report" was removed because "Theft" conveys just as much meaning.
`;

export const THIRD_PASS_CLASSIFY = (categories: string[]) => `
You are tasked with mapping customer intents from a customer experience helpline you will receive a json indexed by id containing intents to categorize.
You must map its matching category to its id and return the json.
You MUST assign it to one of the following categories: ${categories.join(", ")}.
It MUST be the most applicable and relevent category of that intent.
Return JSON in plain text, do not format with markdown!
Do not insert newlines.
Categorize intents with undecidable categories as "Unknown" not ''.
`;

export const LIST_RESPONSE_FORMAT = {
  format: z.object({
    listResponse: z.array(z.string()),
  }),
  name: "list_response",
};
