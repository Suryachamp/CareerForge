const mongoose = require("mongoose");
const ResumeModel = require("../models/resume.model");
const InterviewReportModel = require("../models/interviewreport.model");

async function connectToDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to Database")

        // Migration: ensure all old resumes have a persistent UUID saved in the database
        const resumesWithoutUuid = await ResumeModel.find({ 
            $or: [
                { uuid: { $exists: false } },
                { uuid: null }
            ]
        });
        if (resumesWithoutUuid.length > 0) {
            console.log(`Migrating ${resumesWithoutUuid.length} resumes to add UUIDs...`);
            for (const resume of resumesWithoutUuid) {
                resume.uuid = require("crypto").randomUUID();
                await resume.save();
            }
            console.log("Migration complete!");
        }

        // Migration: ensure all old interview reports have a persistent UUID saved in the database
        const reportsWithoutUuid = await InterviewReportModel.find({ 
            $or: [
                { uuid: { $exists: false } },
                { uuid: null }
            ]
        });
        if (reportsWithoutUuid.length > 0) {
            console.log(`Migrating ${reportsWithoutUuid.length} interview reports to add UUIDs...`);
            for (const report of reportsWithoutUuid) {
                report.uuid = require("crypto").randomUUID();
                await report.save();
            }
            console.log("Interview reports migration complete!");
        }
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectToDB;