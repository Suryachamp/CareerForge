const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// Schema written directly in Gemini's native format — no zodToJsonSchema
// This guarantees Gemini returns properly structured objects
const interviewReportSchema = {
  type: Type.OBJECT,
  properties: {
    matchScore: {
      type: Type.NUMBER,
      description:
        "The match score between the candidate and the job description, ranging from 0 to 100",
    },
    technicalQuestions: {
      type: Type.ARRAY,
      description:
        "Technical questions that can be asked in the interview along with their intention and how to answer them",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description:
              "The technical question that can be asked in the interview",
          },
          intention: {
            type: Type.STRING,
            description:
              "The intention of interviewer behind asking this question",
          },
          answer: {
            type: Type.STRING,
            description:
              "How to answer this question, what points to cover, what approaches to take etc.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behaviouralQuestions: {
      type: Type.ARRAY,
      description:
        "Behavioural questions that can be asked along with their intention and how to answer them",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description:
              "The behavioural question that can be asked in the interview",
          },
          intention: {
            type: Type.STRING,
            description:
              "The intention of interviewer behind asking this question",
          },
          answer: {
            type: Type.STRING,
            description:
              "How to answer this question, what points to cover, what approaches to take etc.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: Type.ARRAY,
      description:
        "List of skill gaps in the candidates profile with severity",
      items: {
        type: Type.OBJECT,
        properties: {
          skill: {
            type: Type.STRING,
            description: "Name of the skill the candidate is lacking",
          },
          severity: {
            type: Type.STRING,
            description:
              "The severity of the skill gap. Must be one of: low, medium, high",
          },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: Type.ARRAY,
      description:
        "A day-wise preparation plan for the candidate based on their skill gaps and the job description",
      items: {
        type: Type.OBJECT,
        properties: {
          day: {
            type: Type.NUMBER,
            description:
              "The day number in the preparation plan, starting from 1",
          },
          focus: {
            type: Type.STRING,
            description: "The main area of focus for that day",
          },
          task: {
            type: Type.STRING,
            description:
              "All specific tasks to be completed on that day, combined into a single string",
          },
        },
        required: ["day", "focus", "task"],
      },
    },
  },
  required: [
    "matchScore",
    "technicalQuestions",
    "behaviouralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
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
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: interviewReportSchema,
      },
    });

    console.log("Raw Gemini response.text:", response.text);
    const report = JSON.parse(response.text);
    console.log("Parsed AI Report keys:", Object.keys(report));
    return report;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return null;
  }
}

module.exports = generateInterviewReport;