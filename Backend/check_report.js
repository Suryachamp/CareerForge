require("dotenv").config();
const mongoose = require("mongoose");
const connectToDB = require("./src/config/db");
const interviewReportModel = require("./src/models/interviewreport.model");

async function run() {
  await connectToDB();
  const id = "69b113ee-8444-455c-9232-424255645efe";
  console.log("Searching for report with ID/UUID:", id);

  const reportById = mongoose.Types.ObjectId.isValid(id)
    ? await interviewReportModel.findById(id)
    : null;
  const reportByUuid = await interviewReportModel.findOne({ uuid: id });

  console.log("Result by _id:", reportById);
  console.log("Result by uuid:", reportByUuid);

  const allReports = await interviewReportModel.find(
    {},
    { uuid: 1, user: 1, _id: 1 },
  );
  console.log("All reports in database:", allReports);

  mongoose.disconnect();
}

run();
