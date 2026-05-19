import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper to safely convert an image URL to a clean Base64 PNG string
const getBase64ImageFromUrl = async (url: string): Promise<string | null> => {
  if (!url) return null;

  try {
    // We use fetch because it handles cross-origin requests cleaner than new Image()
    const response = await fetch(url, {
      mode: "cors", // Requests CORS headers from S3
      cache: "no-cache", // Prevents caching stale CORS headers
    });

    if (!response.ok) {
      console.warn(`Failed to fetch invoice logo: ${response.statusText}`);
      return null;
    }

    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    // If CORS fails, we simply return null so the PDF still generates without the logo
    console.warn(
      "Could not load invoice logo (likely S3 CORS issue). Generating PDF without logo.",
    );
    return null;
  }
};

export const generateInvoicePDF = async (
  transaction: any,
  company_domain: string,
  company_name: string,
  company_logo_path: string,
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Initialize Document
      const doc = new jsPDF("p", "pt", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      let logoDataUrl: string | null = null;
      let logoAspectRatio = 1;

      logoDataUrl = await getBase64ImageFromUrl("/navlogo.png");

      if (logoDataUrl) {
        const img = new Image();
        img.src = logoDataUrl;
        await new Promise((r) => (img.onload = r));
        logoAspectRatio = img.height / img.width;
      }

      // -- Blue Header Background --
      doc.setFillColor("#F8FAFC");
      doc.rect(0, 0, pageWidth, 140, "F");

      // -- Logo Rendering --
      if (logoDataUrl) {
        const logoWidth = 120;
        const logoHeight = logoAspectRatio * logoWidth;
        // Limit height to prevent overlap
        const finalHeight = logoHeight > 50 ? 50 : logoHeight;
        const finalWidth = finalHeight / logoAspectRatio;

        doc.addImage(logoDataUrl, "PNG", 40, 40, finalWidth, finalHeight);
      }

      // -- Company Info (Top Right) --
      const companyInfoX = pageWidth - 40;
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("AtticBits Solutions Private Limited", companyInfoX, 40, {
        align: "right",
      });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("atticbits.com", companyInfoX, 60, {
        align: "right",
      });

      // -- Invoice Details Section --
      const contentStartY = 160;

      doc.setTextColor(40, 40, 40);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE DETAILS", 40, contentStartY);

      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(1);
      doc.line(40, contentStartY + 5, 280, contentStartY + 5);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);

      const leftColY = contentStartY + 25;

      // Transaction ID (moved above Invoice Date)
      doc.text("Transaction ID:", 40, leftColY);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 40, 40);
      doc.text(transaction.transaction_id, 120, leftColY);

      // Invoice Date
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text("Invoice Date:", 40, leftColY + 20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 40, 40);
      const date = new Date(transaction.payment_date);
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      const time = date.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      doc.text(`${day} ${month} ${year}, ${time}`, 120, leftColY + 20);

      // -- Billed To Section (Right Side) --
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("BILLED TO", pageWidth - 260, contentStartY);

      doc.setDrawColor(230, 230, 230);
      doc.line(
        pageWidth - 260,
        contentStartY + 5,
        pageWidth - 40,
        contentStartY + 5,
      );

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);

      const rightColY = contentStartY + 25;

      // Company Name with separate colors
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text("Company: ", pageWidth - 260, rightColY);

      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.text(company_name || "Company Name", pageWidth - 210, rightColY, {
        maxWidth: 150,
      });

      // Website with separate colors
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text("Website: ", pageWidth - 260, rightColY + 20);

      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.text(
        company_domain || "company.com",
        pageWidth - 210,
        rightColY + 20,
        {
          maxWidth: 150,
        },
      );

      // Email with separate colors
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text("Email: ", pageWidth - 260, rightColY + 40);

      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.text(transaction.card_email, pageWidth - 220, rightColY + 40, {
        maxWidth: 140,
      });

      // -- Currency Helper --
      const formatInvoiceCurrency = (amount: number): string => {
        const currency = transaction.currency?.toUpperCase() || "INR";
        const formatted = amount.toFixed(2);
        if (currency === "INR") return `Rs. ${formatted}`;
        if (currency === "USD") return `$ ${formatted}`;
        return `${currency} ${formatted}`;
      };

      // -- Calculate amounts for INR tax --
      const currency = transaction.currency?.toUpperCase() || "INR";
      const isINR = currency === "INR";
      const quantity = Number(transaction.user_count) || 1;
      const unitPrice =
        transaction.subscription?.plan?.price ||
        (isINR
          ? Number(transaction.amount) / 1.18
          : Number(transaction.amount));
      const subtotalAmount = unitPrice * quantity;
      const taxRate = 0.18; // 18% tax for INR
      const taxAmount = isINR ? subtotalAmount * taxRate : 0;
      const totalAmount = subtotalAmount + taxAmount;

      // -- Table --
      const tableStartY = contentStartY + 200;

      autoTable(doc, {
        startY: tableStartY,
        head: [["Item", "Qty", "Price", "Total"]],
        body: [
          [
            transaction.subscription?.plan?.name || "Subscription Plan",
            quantity.toString(),
            formatInvoiceCurrency(unitPrice),
            formatInvoiceCurrency(subtotalAmount),
          ],
        ],
        theme: "grid",
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [40, 40, 40],
          fontStyle: "bold",
          fontSize: 10,
          cellPadding: 10,
        },
        bodyStyles: {
          textColor: [60, 60, 60],
          fontSize: 10,
          cellPadding: 10,
          lineColor: [220, 220, 220],
          lineWidth: 0.5,
        },
        columnStyles: {
          0: { halign: "left", cellWidth: 160 },
          1: { halign: "center", cellWidth: 100 },
          2: { halign: "right", cellWidth: 130 },
          3: { halign: "right", cellWidth: 130 },
        },
        margin: { left: 40, right: 40 },
      });

      // -- Summary Section --
      const finalY = (doc as any).lastAutoTable.finalY + 30;
      const summaryBoxX = pageWidth - 240;
      const summaryLabelX = summaryBoxX;
      const summaryValueX = pageWidth - 40;

      // Subtotal
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text("Subtotal:", summaryLabelX, finalY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      doc.text(formatInvoiceCurrency(subtotalAmount), summaryValueX, finalY, {
        align: "right",
      });

      // Tax (18% for INR)
      let taxLineY = finalY + 20;
      if (isINR && taxAmount > 0) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text("Tax (18%):", summaryLabelX, taxLineY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40, 40, 40);
        doc.text(formatInvoiceCurrency(taxAmount), summaryValueX, taxLineY, {
          align: "right",
        });
        taxLineY += 20;
      }

      // Total Line
      doc.setDrawColor(0, 130, 255);
      doc.setLineWidth(1);
      doc.line(summaryLabelX, taxLineY + 10, summaryValueX, taxLineY + 10);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 130, 255);
      doc.text("Total:", summaryLabelX, taxLineY + 30);

      doc.text(
        formatInvoiceCurrency(isINR ? totalAmount : Number(transaction.amount)),
        summaryValueX,
        taxLineY + 30,
        {
          align: "right",
        },
      );

      // -- Payment Info Box --
      const paymentInfoY = taxLineY + 80;

      // Page break check
      if (paymentInfoY + 60 > pageHeight - 40) {
        doc.addPage();
      }

      doc.setFillColor(245, 247, 250);
      doc.roundedRect(40, paymentInfoY, pageWidth - 80, 60, 3, 3, "F");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 40, 40);
      doc.text("PAYMENT INFORMATION", 55, paymentInfoY + 20);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(
        `Payment Method: ${transaction.payment_details?.method?.toUpperCase() || transaction.card?.network?.toUpperCase() || "N/A"}`,
        55,
        paymentInfoY + 38,
      );
      doc.text(
        `Transaction ID: ${transaction.transaction_id}`,
        55,
        paymentInfoY + 52,
      );

      doc.text(
        `Status: ${transaction.status?.toUpperCase() || "SUCCESS"}`,
        pageWidth - 180,
        paymentInfoY + 38,
      );

      // -- Footer --
      doc.setDrawColor(230, 230, 230);
      doc.line(40, pageHeight - 60, pageWidth - 40, pageHeight - 60);

      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.setFont("helvetica", "italic");
      doc.text(
        "This is a computer-generated invoice and requires no signature.",
        pageWidth / 2,
        pageHeight - 40,
        { align: "center" },
      );
      doc.text(
        "For any queries, please contact our support team.",
        pageWidth / 2,
        pageHeight - 28,
        { align: "center" },
      );

      // 4. Save
      doc.save(`invoice-${transaction.transaction_id}.pdf`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
