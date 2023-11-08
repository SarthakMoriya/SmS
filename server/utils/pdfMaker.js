import  puppeteer from'puppeteer'
import { fileURLToPath } from 'url';
import path from 'path';

export const pdfMaker=async ({name,id}) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  console.log(__dirname )
  // Launch a headless Chrome browser
  const browser = await puppeteer.launch();

  // Open a new page
  const page = await browser.newPage();
 
  // Navigate to a website
  await page.goto(`http://localhost:3000/record/pdf/${id}`);

  // Take a screenshot of the page
  await page.screenshot({ path: `uploads\\pdfs\\${id}.png` });

  // Close the browser
  await browser.close();
}
