import puppeteer from "puppeteer-core";

export async function visitAndScrape(url: string) {
  const wsEndpoint = process.env.LIGHTPANDA_WS_ENDPOINT;
  
  if (!wsEndpoint) {
    console.warn("LIGHTPANDA_WS_ENDPOINT not set. Mocking response.");
    return { title: "Mock Title", content: "Mock content from Lightpanda" };
  }

  console.log(`[Lightpanda] Visiting ${url}...`);

  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Basic extraction
    const title = await page.title();
    const content = await page.content(); // Get full HTML or use page.evaluate to extract specific text
    
    await browser.close();
    
    return {
      title,
      contentLength: content.length,
      // In reality, we would parse 'content' to find emails/tech stack
    };

  } catch (error) {
    console.error(`[Lightpanda] Error visiting ${url}:`, error);
    return null;
  }
}
