import createDatabasePool from "../libs/config/db.config";
import puppeteer from "puppeteer";


export async function fetchDataFromMariaDB() {
  // Launch Puppeteer and create a new page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let conn;
  const pool = await createDatabasePool();

  try {
    conn = await pool.getConnection();
    const query = `
      SELECT
        Doc.createdAt,
        User.name, User.lastname, User.roles,
        Company.company_name, Company.company_address, Company.company_contact, Company.company_vat_id,
        Customer.name AS customer_name, Customer.lastname AS customer_lastname, Customer.customer_address, Customer.customer_mobile,
        (
          SELECT GROUP_CONCAT(
            CONCAT(
              'Title: ', title, ', ',
              'Size: ', size, ', ',
              'Qty: ', qty, ', ',
              'Price: ', price, ', ',
              'Discount: ', discount, ', ',
              'Total Price: ', total_price
            ) SEPARATOR '; '
          ) FROM Product WHERE Product.doc_id = Doc.id
        ) AS products
      FROM Doc
      JOIN Company ON Doc.dealer_id = Company.id
      JOIN User ON Doc.seller_id = User.id
      JOIN Customer ON Doc.client_id = Customer.id
      WHERE Doc.id = 2;
    `;

    const result = await new Promise((resolve, reject) => {
      pool.query(query, (error: any, results: unknown) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    console.log('Query results:', result);

    // Close database connection
    pool.end();

    // Close Puppeteer browser
    await browser.close();
  } catch (error) {
    console.error('Error:', error);
    // Close Puppeteer browser in case of error
    await browser.close();
  }
}

fetchDataFromMariaDB();
