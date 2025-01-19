import { removeStopWordsString } from "src/utils/removeStopWords";

const rawIntentsExample = [
    "Ignite international data roaming",
    "Demand service for broken apparatus",
    "Demand a copy of previous invoices",
    "Solve a technical mystery",
    "Implore a temporary service interruption",
    "Ache for a temporary service stoppage",
    "Invigorate a service stoppage",
    "Gather information on the data utilization and surcharge",
    "Trigger the onboarding process for a brand-new handset or internet service"
].map((rie) => removeStopWordsString(rie))

const simplifiedIntentsExample = [
    "Activation",
    "Repair",
    "Billing",
    "Technical Support",
    "Service Termination",
    "Service Termination",
    "Service Termination",
    "Usage",
    "Service Connection"
];

export const FIRST_PASS_FEW_SHOT = `
Categorize caller intents coming from a helpline to a Telecommunications company.
Categories relate to customer experience.
Do not use words "Enquiry" or "Inquiry" in the categories.
Do not use plurals in your answer.
Use 2 words maximum, prefer one word.
Use US spelling.
Use capital letters at the start of each word, and no punctuation.
You will be given an array of intents to summarize in which the output will be an array with
the intent category with the same index as the provided intent.
Categorize strings with undecidable intent as "Unknown" not ''.
--- EXAMPLE ---
PROMPT: ${JSON.stringify(rawIntentsExample)}
COMPLETION: ${JSON.stringify(simplifiedIntentsExample)}
`;

export const SECOND_PASS_FEW_SHOT = `
You are tasked with simplifying customer experience categories.
You will be given an array of categories which you will
`