import puppeteer from "puppeteer";
import dotenv from "dotenv";
import path from "path";
dotenv.config();


export async function generatePDF(params : string | any) {
    const filePath = path.join(__dirname, "../../uploads/pdf",`docs-no-${params}-${Date.now()}.pdf`);
    try {
        console.log("Launching browser...");
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser',
            headless: true,
            devtools: true,
            args: [
                '--no-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                '--disable-site-isolation-trials'
            ]
        });
        console.log("Browser launched successfully.");

        console.log("Opening new page...");
        const page = await browser.newPage();
        console.log("New page opened successfully.");

        const website = `${process.env.PDF_URL}/${params}`;
        console.log("Navigating to:", website);
        await page.setBypassCSP(true);

        await page.goto(website, { waitUntil: "networkidle0" });
        console.log("Page navigation complete.");

        console.log("Generating PDF...");
        const pdf = await page.pdf({
            path: filePath,
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
