import PDFDocument from "pdfkit";
import * as fs from "fs";
import * as path from "path";
import { Transaction } from "./validationSchemas";

export async function generatePDF(
  transactions: Transaction[]
): Promise<string> {
  const pdfPath = path.join("/path/to/pdf", "transaction_statement.pdf");
  const pdfDoc = new PDFDocument();

  // Create a PDF file with transactions
  pdfDoc.pipe(fs.createWriteStream(pdfPath));

  pdfDoc
    .fontSize(16)
    .text("Transaction Statement", { align: "center" })
    .moveDown(0.5);

  if (transactions.length === 0) {
    pdfDoc.text("No transactions found for the specified period.");
  } else {
    // Display transactions in a table
    pdfDoc.font("Helvetica-Bold");
    pdfDoc.fontSize(12);

    pdfDoc.text("Date", { width: 100, align: "left" });
    pdfDoc.text("User Email", { width: 200, align: "left" });
    pdfDoc.text("Amount", { width: 100, align: "left" });

    pdfDoc.moveDown(0.5);
    pdfDoc.font("Helvetica");

    transactions.forEach((transaction) => {
      pdfDoc.text(transaction.date_of_transaction, {
        width: 100,
        align: "left",
      });
      pdfDoc.text(transaction.user_email, { width: 200, align: "left" });
      pdfDoc.text(transaction.amount.toString(), { width: 100, align: "left" });
      pdfDoc.moveDown(0.5);
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