import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();
const url = process.env.PDF_URL

export async function generatePDF(params : string | any) {
    try {
        console.log("Launching browser...");
        const browser = await puppeteer.launch();
        console.log("Browser launched successfully.");

        console.log("Opening new page...");
        const page = await browser.newPage();
        console.log("New page opened successfully.");

        const website = `${url}${params}`;
        console.log("Navigating to:", website);

        await page.goto(website, { waitUntil: "networkidle0" });
        console.log("Page navigation complete.");

        console.log("Generating PDF...");
        const pdf = await page.pdf({
            path: `${website}.pdf`,
            margin: { top: '10px', right: '5px', bottom: '10px', left: '5px' },
            printBackground: true,
            format: 'A4',
        });
        console.log("PDF generated successfully.");

        await browser.close();
        console.log("Browser closed.");

        return pdf;
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }
}
