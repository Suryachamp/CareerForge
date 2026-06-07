const pdfParse = require('pdf-parse')

async function generateInterviewReportController(req,res){
    const resumeFile = req.file;

    const resumeContent = pdfParse(req.file.buffer)
    const {selfDescription,jobDescription} = req.body
}


module.exports = {generateInterviewReportController}