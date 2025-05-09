import React from "react";
import domtoimage from "dom-to-image-more";

const AnalyticsExport = () => {
  const downloadImage = () => {
    const node = document.getElementById("chart-section");
    if (!node) return alert("Chart section not found!");

    domtoimage
      .toPng(node)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "campaign_analytics.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Image export failed:", error);
      });
  };

  const downloadPDF = () => {
    const node = document.getElementById("chart-section");
    if (!node) return alert("Chart section not found!");

    domtoimage
      .toPng(node)
      .then((dataUrl) => {
        const pdfWindow = window.open("", "_blank");
        pdfWindow.document.write(`
          <html>
            <head><title>Campaign Report</title></head>
            <body style="margin:0;padding:0;">
              <img src="${dataUrl}" style="width:100%;" />
            </body>
          </html>
        `);
        pdfWindow.document.close();
        pdfWindow.focus();
        pdfWindow.print();
      })
      .catch((error) => {
        console.error("PDF export failed:", error);
      });
  };

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={downloadImage}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        Download Image
      </button>
      <button
        onClick={downloadPDF}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        Download PDF
      </button>
    </div>
  );
};

export default AnalyticsExport;
