const express = require('express');
const PDFDocument = require('pdfkit');
const bundles = require('./bundles.json');

const app = express();

app.use(express.static(__dirname));

app.get('/bundles.csv', (req, res) => {
  const header = 'name,terms\n';
  const rows = bundles.bundles
    .map(b => `${b.name},"${b.terms.join(';')}"`)
    .join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="bundles.csv"');
  res.send(header + rows);
});

app.get('/bundles.pdf', (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="bundles.pdf"');
  const doc = new PDFDocument();
  doc.pipe(res);
  doc.fontSize(18).text('Bundles', { align: 'center' });
  doc.moveDown();
  bundles.bundles.forEach(b => {
    doc.fontSize(14).text(b.name);
    doc.fontSize(12).list(b.terms);
    doc.moveDown();
  });
  doc.end();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
