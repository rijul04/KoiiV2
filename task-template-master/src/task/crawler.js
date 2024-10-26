import PCR from "puppeteer-chromium-resolver";

export async function crawl(searchTerm) {
  const options = {};
  const stats = await PCR(options);
  console.log(`Chrome Path: ${stats.executablePath}`);

  // Set up puppeteer
  const browser = await stats.puppeteer.launch({
    headless: true,
    executablePath: stats.executablePath,
  });

  // Open a new page
  const page = await browser.newPage();
  // Set the user agent to a common browser user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
  );
  
  // Navigate to Google search page with a specific query
  const url = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Wait for the search results to load
  await page.waitForSelector("h3");

  // Get the titles of the search result links
  let titles = null;
  try {
    titles = await page.$$eval("h3", (elements) =>
      elements.map((element) => element.textContent.trim())
    );
  } catch (error) {
    console.log("Error:", error);
  }

  // Close puppeteer
  await browser.close();
  return titles;
}

// async function main() {
//   try {
//     // Call the crawl function and store the result in a variable
//     const titles = await crawl("Milk");

//     // Use forEach to iterate over the titles array
//     titles.forEach((title, index) => {
//       console.log(`Title ${index + 1}: ${title}`);
//     });

//   } catch (error) {
//     console.error("An error occurred:", error);
//   }
// }

// main();
