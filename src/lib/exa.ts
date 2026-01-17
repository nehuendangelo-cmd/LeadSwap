import Exa from "exa-js";
import dotenv from "dotenv";

dotenv.config();

const exa = new Exa(process.env.EXA_API_KEY);

export async function searchLeads(query: string, numResults: number = 5) {
  if (!process.env.EXA_API_KEY) {
    throw new Error("EXA_API_KEY is missing");
  }

  console.log(`[Exa] Searching for: "${query}"...`);
  
  // Example of using Exa to find companies
  // In a real scenario, we might use useAutoprompt: true
  const result = await exa.searchAndContents(
    query,
    {
      type: "neural",
      useAutoprompt: true,
      numResults: numResults,
      text: true
    }
  );

  return result.results;
}
