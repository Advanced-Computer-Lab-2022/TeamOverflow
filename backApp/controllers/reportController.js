const Report = require("../models/Report")
const Followup = require("../models/ReportFollowup")

async function reportProblem(req, res) {
    try {
        var report = await Report.create({
            userId: req.reqId,
            userRef: req.userRef,
            type: req.body.type,
            details: req.body.details,
            courseId: req.body.courseId
        })
        res.status(201).json({ message: "Report Successful" })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function viewReports(req, res) {
    try {
        const status = req.query.status || { $regex: ".*" }
        const type = req.query.type || { $regex: ".*" }
        var reports = await Report.paginate({ userId: req.reqId, type: type, status: status }, { page: req.query.page, limit: 12 })
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
            res.status(201).json({ message: "Follow Up Added" })
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