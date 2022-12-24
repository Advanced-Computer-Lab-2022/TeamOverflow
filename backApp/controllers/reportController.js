const Report = require("../models/Report")
const Followup = require("../models/ReportFollowup")

async function reportProblem(req, res) {
    try {
        var report = await Report.create({
            userId: req.reqId,
            type: req.body.type,
            details: req.body.details
        })
        res.status(201).json(report)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function viewReports(req, res) {
    try {
        var reports = await Report.paginate({ userId: req.reqId }, { page: req.query.page, limit: 10 })
        res.status(200).json(reports)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function viewOneReport(req, res) {
    try {
        var report = await Report.findOne({ _id: req.query.reportId, userId: req.reqId })
        if (report) {
            var followups = await Followup.find({ reportId: req.query.reportId })
            res.status(200).json({ report: report, followups: followups })
        } else {
            res.status(404).json({ message: "Report Not Found" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function addFollowup(req, res) {
    try {
        var report = await Report.findOne({ _id: req.body.reportId, userId: req.reqId })
        if (report && report.status !== "Resolved") {
            var followup = await Followup.create({
                reportId: req.body.reportId,
                content: req.body.content
            })
            res.status(201).json(followup)
        } else if (Report) {
            res.status(403).json({ message: "Cannot add follow up to a resolved problem" })
        } else {
            res.status(404).json({ message: "Report Not Found" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = { reportProblem, viewOneReport, viewReports, addFollowup }