"use client";

import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";

function QRCodeGenerator({ slug, title }) {
  const baseUrl = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? `:${window.location.port}` : ""
  }`;

  const url = `${baseUrl}/${slug}`;

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=500,height=500");

    // Write the QR code canvas to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
        </head>
        <body style="text-align: center; margin: 2rem;">
          <h2>${title}</h2>
          ${document.getElementById("QR-Code").innerHTML}
        </body>
      </html>
    `);

    // Close the document stream and trigger print
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

    // Close the window after printing (optional, comment out if you want it to stay open)
    printWindow.onafterprint = () => printWindow.close();
  };

  const handleDownload = () => {
    // Get the canvas element from QRCodeCanvas
    const canvas = document.getElementById("QR-Image");

    // Convert the canvas to a data URL (PNG format by default)
    const image = canvas.toDataURL("image/png");

    // Create a temporary link element for downloading
    const link = document.createElement("a");
    link.href = image;
    link.download = `${title || "QR-Code"}.png`; // File name based on title or default
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  };

  return (
    <div className="mt-10">
      <h2>QR Code {url}</h2>
      <br />
      <div id="QR-Code">
        <QRCodeSVG value={url} size={256} level="H" />
      </div>
      <QRCodeCanvas
        value={url}
        size={256}
        level="H"
        className="hidden"
        id="QR-Image"
      />

      <button
        onClick={handlePrint}
        className="cursor-pointer min-w-fit px-3 py-1 rounded-full transition-colors bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white mt-4"
      >
        Print QR Code
      </button>

      <button
        onClick={handleDownload}
        className="ml-4 cursor-pointer min-w-fit px-3 py-1 rounded-full transition-colors bg-gradient-to-bl from-[#e45053] to-[#fd9c46] text-white mt-4"
      >
        Download QR Code
      </button>
    </div>
  );
}

export default QRCodeGenerator;
