const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const Report = require('../models/Report');
const VerificationHistory = require('../models/VerificationHistory');
const DeepfakeResult = require('../models/DeepfakeResult');

const outDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

/**
 * Generate a PDF and Excel report for the authenticated user's verification history.
 * Saves the generated files in the `uploads` folder and records a Report entry.
 */
exports.generateReport = async (req, res, next) => {
  try {
    // basic report: gather all user's verifications
    const news = await VerificationHistory.find({ user: req.user._id }).lean();
    const images = await DeepfakeResult.find({ user: req.user._id }).lean();
    const all = [...news.map(n=>({type:'news', item:n})), ...images.map(i=>({type:'deepfake', item:i}))];

    // generate PDF
    const pdfPath = path.join(outDir, `report-${Date.now()}.pdf`);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(18).text('Verification Report', { align: 'center' });
    doc.moveDown();
    all.forEach(r => {
      doc.fontSize(12).text(`${r.type.toUpperCase()} - ${r.item._id}`);
      doc.text(JSON.stringify(r.item.details || r.item, null, 2));
      doc.moveDown();
    });
    doc.end();

    // generate Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Report');
    sheet.columns = [
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Id', key: 'id', width: 30 },
      { header: 'Result', key: 'result', width: 20 },
      { header: 'Date', key: 'date', width: 25 }
    ];
    all.forEach(r => {
      sheet.addRow({ type: r.type, id: r.item._id.toString(), result: r.item.result || r.item.label, date: r.item.createdAt });
    });
    const xlsxPath = path.join(outDir, `report-${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(xlsxPath);

    const report = new Report({ user: req.user._id, title: 'Verification report', content: 'Auto-generated', attachments: [pdfPath, xlsxPath], status: 'closed' });
    await report.save();

    res.json({ id: report._id, pdf: pdfPath, xlsx: xlsxPath });
  } catch (err) {
    next(err);
  }
};

/**
 * List generated reports for the authenticated user.
 */
exports.listReports = async (req, res, next) => {
  try {
    const items = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
};

/**
 * Return a saved report metadata by id.
 */
exports.getById = async (req, res, next) => {
  try {
    const item = await Report.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};
