// require dependencies
const PDFDocument = require('pdfkit');
const Notes = require("../models/Notes");
const moment = require("moment");
const Course = require('../models/Course');
const { sendGenericEmail } = require('./mailingController');
const fs = require("fs");

async function getNotes(req, res) {
    const notes = await Notes.find({ traineeId: req.reqId, videoId: req.query.videoId }, undefined, { sort: "timestamp", populate: "videoId" })
    const doc = new PDFDocument({ font: 'Times-Roman' });
    const filename = `${notes[0].videoId.title} Notes`;
    doc.fontSize(42).text(`Notes for ${notes[0].videoId.title}`, { align: 'center' });
    notes.map((note) => {
        doc.font("Times-Italic").fontSize(16).text(`${moment().startOf('day').seconds(note.timestamp).format('hh:mm:ss')} :-`, { paragraphGap: 2 });
        doc.font("Times-Roman").fontSize(20).text(note.content, { align: "justify", indent: 10, paragraphGap: 8 });
    })
    res.append('Access-Control-Expose-Headers', 'Filename, Content-Transfer-Encoding')
    res.writeHead(201, {
        'Filename': `${filename}.pdf`,
        'Content-Type': 'application/pdf',
        'Content-Transfer-Encoding': 'binary'
    })
    doc.pipe(res)
    doc.end();
}


async function downloadCertificate(req, res) {
    var course = await Course.findById(req.query.courseId)
    const doc = new PDFDocument({ font: 'Times-Roman', layout: "landscape", size: 'A4' });
    const filename = `${req.user.name} - ${course.title} Certificate.pdf`;
    const writeStream = fs.createWriteStream(filename);
    doc.pipe(writeStream);
    res.append('Access-Control-Expose-Headers', 'Filename, Content-Transfer-Encoding')
    res.writeHead(201, {
        'Filename': filename,
        'Content-Type': 'application/pdf',
        'Content-Transfer-Encoding': 'binary'
    })
    doc.pipe(res)
    doc.image(`public/images/logo192.png`, doc.page.width/2 - 100, 10, { align: 'center', width: 200 })
    doc.moveDown(12)
    doc.fontSize(42).font("Times-Bold").text(`Congratulations!`, { align: 'center' });
    doc.fontSize(42).font("Times-Roman").text(`You have completed: ${course.title}`, { align: 'center' });
    doc.fontSize(30).text(`This Certificate Is Issued To ${req.user.name}`, { align: 'center' });
    doc.fontSize(16).text(`Issued on ${moment().format("DD/MM/yyyy")}`, 110, 500, { align: 'right', valign: 'bottom' });
    doc.end();
    writeStream.on('finish', async function () {
        const content = `
        <h1>Hello ${req.user.name} !</h1>
        <p>Congratulations on completing the course "${course.title}"</p><br/>
        <p>Kindly find attached your certificate</p>
      `
        const attachments = [{
            filename: filename,
            path: filename,
            contentType: 'application/pdf'
        }]

        await sendGenericEmail(req.user.email, "Certificate of Completion", content, attachments).then(() => {
            fs.unlinkSync(filename)
        })
    });
}



module.exports = { getNotes, downloadCertificate }