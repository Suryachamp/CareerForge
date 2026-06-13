const mongoose = require("mongoose");
const ResumeModel = require("../models/resume.model");

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
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectToDB;