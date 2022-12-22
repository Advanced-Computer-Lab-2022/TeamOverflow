// require dependencies
const PDFDocument = require('pdfkit');
const fs = require("fs")
const Notes = require("../models/Notes");
const moment = require("moment");

async function getNotes(req, res) {
    const notes = await (await Notes.find({ traineeId: req.reqId, videoId: req.query.videoId }, undefined, {sort: "timestamp", populate:"videoId"}))
    const doc = new PDFDocument({ font: 'Times-Roman' });
    const filename = `${notes[0].videoId.title} Notes`;
    doc.fontSize(42).text(`Notes for ${notes[0].videoId.title}`, { align: 'center' });
    notes.map((note) => {
        doc.font("Times-Italic").fontSize(16).text(`${moment().startOf('day').seconds(note.timestamp).format('mm:ss')} :-`, { paragraphGap: 2 });
        doc.font("Times-Roman").fontSize(20).text(note.content, { align: "justify", indent: 10, paragraphGap: 8 });
    })
    res.append('Access-Control-Expose-Headers', 'Filename, Content-Transfer-Encoding')
    res.writeHead(201,{
        'Filename': `${filename}.pdf`,
        'Content-Type': 'application/pdf',
        'Content-Transfer-Encoding': 'binary'
    })
    doc.pipe(res)
    doc.end();
}

module.exports = { getNotes }