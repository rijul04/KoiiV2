import { timeout } from "puppeteer";
import PCR from "puppeteer-chromium-resolver";
import Sentiment from "sentiment";

export async function crawl(searchTerm, numPages = 3) {
  const options = {};
  const stats = await PCR(options);
  console.log(`Chrome Path: ${stats.executablePath}`);

  // Set up puppeteer
  const browser = await stats.puppeteer.launch({
    //headless: false,
    //slowMo: 500,
    executablePath: stats.executablePath,
  });

  // Open a new page
  const page = await browser.newPage();
  // Set the user agent to a common browser user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
  );
  
  let allTitles = [];

  // Navigate to Google search page with a specific query
  const url = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
  await page.goto(url, { waitUntil: "domcontentloaded"});

  try {
    // Replace '#L2AGLb' with the actual selector for the "Accept All" button if different
    await page.waitForSelector('#L2AGLb', { timeout: 5000 });
    await page.click('#L2AGLb');
    console.log("Accepted cookies consent.");
  } catch (error) {
    console.log("No cookies popup detected, proceeding without it.");
  }

  //scrape from multiple pages
  for (let i=0;i<numPages;i++){
  // Wait for the search results to load
  await page.waitForSelector("h3");
  

  //get titles from current page
  const titles = await page.$$eval("h3", (elements) =>
    elements.map((element) => element.textContent.trim())
  );
  allTitles.push(...titles);

  //click next button to go to next page
  const nextButton = await page.$("#pnnext"); 
  if (nextButton) {
    console.log("button FOUND");
    await nextButton.click();
    console.log("button CLICKED");
    await page.waitForNavigation({ waitUntil: "domcontentloaded"});
  } else {
    console.log("No more pages available.");
    break;
  }
}

  // Close puppeteer
  await browser.close();
  //return titles;
  return allTitles;
}

async function main() {

  const sentiment = new Sentiment();
  
  try {
    // Call the crawl function and store the result in a variable
    const titles = await crawl("best", 3);

    // Use forEach to iterate over the titles array
    titles.forEach((title, index) => {
      const result = sentiment.analyze(title);
      console.log(`Title ${index + 1}: ${title}`);
      console.log(`Sentiment score: ${result.score}`)
      console.log(`Sentiment Analysis Details:`, result)
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();