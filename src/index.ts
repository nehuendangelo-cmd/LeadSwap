import { searchLeads } from "./lib/exa";
import { visitAndScrape } from "./lib/lightpanda";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 Starting LeadSwap Agent Loop...");

  // 1. User Input (Simulated)
  const userQuery = "SaaS startups in France dealing with GreenTech";
  
  // 2. Search Phase (Exa)
  try {
    const leads = await searchLeads(userQuery, 3);
    console.log(`Found ${leads.length} potential leads.`);

    // 3. Enrichment Phase (Lightpanda)
    for (const lead of leads) {
      console.log(`\n-----------------------------------`);
      console.log(`Analyzing: ${lead.title} (${lead.url})`);
      
      const details = await visitAndScrape(lead.url);
      
      if (details) {
        console.log(`✅ Status: Verified`);
        console.log(`   Page Title: ${details.title}`);
        console.log(`   Content Scraped: ${details.contentLength} chars`);
      } else {
        console.log(`❌ Status: Failed to access`);
      }
    }

  } catch (err) {
    console.error("Error in agent loop:", err);
  }
  
  console.log("\n🏁 Agent run complete.");
}

main();
