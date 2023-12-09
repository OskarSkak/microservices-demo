import PDFDocument from "pdfkit";
import * as fs from "fs";
import * as path from "path";
import { Transaction } from "./validationSchemas";

export async function generatePDF(
  transactions: Transaction[]
): Promise<string> {
  const pdfPath = path.join("/path/to/pdf", "transaction_statement.pdf");
  const pdfDoc = new PDFDocument();

  pdfDoc.pipe(fs.createWriteStream(pdfPath));

  pdfDoc
    .fontSize(16)
    .text("Transaction Statement", { align: "center" })
    .moveDown(0.5);

  if (transactions.length === 0) {
    pdfDoc.text("No transactions found for the specified period.");
  } else {
    pdfDoc.font("Helvetica-Bold").fontSize(12);

    const startX = 50; // Starting X coordinate for the first column
    const lineHeight = 20; // Line height for each row
    let currentY = 100; // Starting Y coordinate

    // Header
    pdfDoc.text("Date", startX, currentY);
    pdfDoc.text("User Email", startX + 100, currentY);
    pdfDoc.text("Amount", startX + 300, currentY);

    currentY += lineHeight;
    pdfDoc.font("Helvetica");

    // Rows
    transactions.forEach((transaction) => {
      pdfDoc.text(transaction.date_of_transaction, startX, currentY);
      pdfDoc.text(transaction.user_email, startX + 100, currentY);
      pdfDoc.text(transaction.amount.toString(), startX + 300, currentY);
      currentY += lineHeight;
    });
  }

  pdfDoc.end();

  return pdfPath;
}

export async function createDummyPDF(): Promise<string> {
  // Dummy transactions data
  const dummyTransactions: Transaction[] = [
    { date_of_transaction: "2023-01-01", user_email: "user1@example.com", amount: 100 },
    { date_of_transaction: "2023-01-02", user_email: "user2@example.com", amount: 200 },
  ];

  try {
    const pdfPath = await generatePDF(dummyTransactions);
    console.log(`PDF generated at: ${pdfPath}`);
    return pdfPath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return "";
  }
}
