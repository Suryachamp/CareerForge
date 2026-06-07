const { GoogleGenAI }=require("@google/genai")
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");


const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
});


const interviewReportSchema = z.object({
    technicalQuestions: z.array(
        z.object({
            question:z.string().describe("The technical question that can be asked in the interview"),
            intention:z.string().describe("The intention of interviewer to ask this question"),
            answer:z.string().describe("Explain in details about this question"),
        })
    )
})

async function generateInterviewReport({resume,selfDescription,JobDescription}){



}

module.exports =invokeGeminiAi