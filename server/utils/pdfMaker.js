import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

export const pdfMaker = async ({ name, id }) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Launch a headless Chrome browser
  const browser = await puppeteer.launch();

  // Open a new page
  const page = await browser.newPage();

  // Navigate to a website
  await page.goto(`http://localhost:3000/record/pdf/${id}`);

  // Set the viewport to cover the entire page
  await page.setViewport({ width: 640, height: 100 });

  // Generate PDF of the entire page
  await page.pdf({
    path: `uploads/pdfs/${id}.pdf`,
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });

  // Close the browser
  await browser.close();
};
