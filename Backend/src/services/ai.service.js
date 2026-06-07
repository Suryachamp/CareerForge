const { GoogleGenAI }=require("@google/genai")
const { z, json } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");


const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
});


const interviewReportSchema = z.object({

    matchScore:z.number().min(0).max(100).describe("The match score between the candidate and the job description, ranging from 0 to 100"),

    technicalQuestions: z.array(
        z.object({
            question:z.string().describe("The technical question that can be asked in the interview"),
            intention:z.string().describe("The intention of interviewer behind asking this question"),
            answer:z.string().describe("How to answer this question, what points to cover, what approaches to take etc."),
        })
    ).describe("Technical Questions that can be asked in the interview along with their intention and how to answer them"),

    behaviouralQuestions: z.array(
        z.object({
            question:z.string().describe("The technical question that can be asked in the interview"),
            intention:z.string().describe("The intention of interviewer behind asking this question"),
            answer:z.string().describe("How to answer this question, what points to cover, what approaches to take etc."),
        })
    ).describe("Behavioural questions that can be asked along with their intention and how to answer them"),

    skillGaps:z.array(
        z.object({
            skill: z.string().describe("skills which the candidate is lacking"),
            severity: z.enum(["low","medium","high"]).describe("The severity of the skill gap")
        })
    ).describe("List of skill gap in the candidates profile along with their severity"),
    
    preparationPlan:z.array(
        z.object({
            day: z.number().describe("The day number in the preparation plan, starting from 1"),
            focus: z.string().describe("The main area of focus for that day"),
            task: z.array(z.string()).describe("Specific tasks to be completed on that day"),
        })
    ).describe("A day wise preparation plan for the candidate, based on their skill gaps and the job description")
})

async function generateInterviewReport({resume,selfDescription,jobDescription}){

    const prompt = `
    
    You are an expert AI interview coach. Your task is to act as an expert interviewer and generate a comprehensive interview report for a candidate based on their resume, self-description, and the job description.

    Please analyze the provided information carefully and generate an interview report that includes the following:

    1. Match Score: Provide a match score between 0 and 100 based on how well the candidate's skills and experience match the job requirements.

    2. Technical Questions: Generate a list of technical questions that can be asked in the interview, along with their intention and suggested answers.

    3. Behavioural Questions: Generate a list of behavioural questions that can be asked in the interview, along with their intention and suggested answers.

    4. Skill Gaps: Identify any skill gaps between the candidate's profile and the job requirements and rate their severity as low, medium, or high.

    5. Preparation Plan: Create a day-wise preparation plan for the candidate to help them prepare for the interview, highlighting areas to focus on and tasks to complete each day.

    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    `

    try {
        const response = await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:prompt,
            config:{
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema)
            }
        });

        console.log(JSON.parse(response.text));
    } catch (error) {
        console.error("Gemini API Error:", error.message);
    }

}

module.exports = generateInterviewReport