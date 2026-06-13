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

    // console.log("Raw Gemini response.text:", response.text);
    const report = JSON.parse(response.text);
    console.log("Parsed AI Report keys:", Object.keys(report));
    return report;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return null;
  }
}

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    atsScoreEstimate: {
      type: Type.NUMBER,
      description: "Estimated ATS compatibility score from 0 to 100 based on keyword density, formatting, and action verbs."
    },
    atsFeedback: {
      type: Type.ARRAY,
      description: "Specific suggestions to improve the resume ATS score further.",
      items: { type: Type.STRING }
    },
    suggestedKeywords: {
      type: Type.ARRAY,
      description: "Keywords from the target job description that were integrated into the resume.",
      items: { type: Type.STRING }
    },
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        links: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING, description: "e.g., GitHub, LinkedIn, Portfolio" },
              url: { type: Type.STRING }
            },
            required: ["label", "url"]
          }
        }
      },
      required: ["name", "email", "phone", "location"]
    },
    summary: { type: Type.STRING, description: "ATS-optimized professional summary containing key skills and experience." },
    skills: {
      type: Type.ARRAY,
      description: "Categorized skills optimized with relevant keywords.",
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "e.g., Languages, Frameworks, Developer Tools" },
          items: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["category", "items"]
      }
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          position: { type: Type.STRING },
          location: { type: Type.STRING },
          dateRange: { type: Type.STRING },
          highlights: {
            type: Type.ARRAY,
            description: "ATS-optimized high-impact bullet points utilizing action verbs and metrics.",
            items: { type: Type.STRING }
          }
        },
        required: ["company", "position", "location", "dateRange", "highlights"]
      }
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          technologies: { type: Type.STRING, description: "Comma-separated list of tech used" },
          date: { type: Type.STRING },
          link: { type: Type.STRING, description: "Optional project URL" },
          highlights: {
            type: Type.ARRAY,
            description: "High-impact bullet points focusing on what was built and the impact.",
            items: { type: Type.STRING }
          }
        },
        required: ["title", "technologies", "date", "highlights"]
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          location: { type: Type.STRING },
          dateRange: { type: Type.STRING },
          gpa: { type: Type.STRING, description: "Optional GPA or percentage" }
        },
        required: ["institution", "degree", "location", "dateRange"]
      }
    },
    certifications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          issuer: { type: Type.STRING },
          date: { type: Type.STRING }
        },
        required: ["name", "issuer", "date"]
      }
    },
    latexCode: {
      type: Type.STRING,
      description: "The complete, valid, ready-to-compile LaTeX source code using the provided standard single-column ATS template. Ensure all special LaTeX characters in content are properly escaped (e.g., % -> \\%, & -> \\&, $ -> \\$, # -> \\#, _ -> \\_, { -> \\{, } -> \\}). Do not wrap inside markdown code block format."
    }
  },
  required: [
    "atsScoreEstimate",
    "atsFeedback",
    "suggestedKeywords",
    "personalInfo",
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "certifications",
    "latexCode"
  ]
};

async function generateAtsResume({
  personalInfo,
  summary,
  skills,
  experience,
  projects,
  education,
  certifications,
  jobDescription,
}) {
  const prompt = `
    You are an expert resume writer and ATS optimization specialist.
    Your task is to take the user's raw resume details and generate an outstanding, ATS-optimized, single-column LaTeX resume that scores above 90 on all ATS platforms.

    Here are the core optimization guidelines:
    1. **Tailor for ATS**: If a target job description is provided, identify and integrate critical keywords into the skills, professional summary, and bullet highlights naturally.
    2. **X-Y-Z Formula**: Write experience and project highlights using strong action verbs (e.g., Developed, Spearheaded, Optimized, Engineered) and metrics where possible, explaining "Accomplished [X] as measured by [Y], by doing [Z]".
    3. **Professional Summary**: Keep it short, powerful, and keyword-rich.
    4. **LaTeX Structure**: Build a standard, single-column resume using clean LaTeX commands. Do not use fancy colors, double columns, or custom fonts that fail ATS parsers. Keep sections in this order: Header, Professional Summary, Skills, Work Experience, Projects, Education, Certifications.
    5. **LaTeX Escapes vs. Plain JSON Fields**:
       - In the standard JSON text fields (like 'summary', 'highlights', 'skills', 'experience', 'projects'), use clean, standard plain text (e.g. use '30%' and 'React & Node.js' directly without any backslash escapes).
       - ONLY inside the final 'latexCode' field, make sure to escape LaTeX special characters (% -> \\%, & -> \\&, $ -> \\$, # -> \\#, _ -> \\_, { -> \\{, } -> \\}, ~ -> \\textasciitilde{}, ^ -> \\textasciicircum{}, \\ -> \\textbackslash{}) so that it compiles perfectly in Overleaf and LaTeX compilers.
       Make sure links/emails use correct syntax.

    Raw Resume Details:
    - Personal Info: ${JSON.stringify(personalInfo)}
    - Summary: ${summary || "Please generate one based on details"}
    - Skills: ${JSON.stringify(skills)}
    - Experience: ${JSON.stringify(experience)}
    - Projects: ${JSON.stringify(projects)}
    - Education: ${JSON.stringify(education)}
    - Certifications: ${JSON.stringify(certifications)}
    - Target Job Description (Optional): ${jobDescription || "Not provided"}

    Standard LaTeX Template to fill:
    \\documentclass[letterpaper,11pt]{article}
    \\usepackage{latexsym}
    \\usepackage[empty]{fullpage}
    \\usepackage{titlesec}
    \\usepackage{marvosym}
    \\usepackage[usenames,dvipsnames]{color}
    \\usepackage{verbatim}
    \\usepackage{enumitem}
    \\usepackage[hidelinks]{hyperref}
    \\usepackage{fancyhdr}
    \\usepackage[english]{babel}
    \\usepackage{tabularx}
    \\input{glyphtounicode}
    \\pagestyle{fancy}
    \\fancyhf{}
    \\fancyfoot{}
    \\renewcommand{\\headrulewidth}{0pt}
    \\renewcommand{\\footrulewidth}{0pt}
    \\addtolength{\\oddsidemargin}{-0.5in}
    \\addtolength{\\evensidemargin}{-0.5in}
    \\addtolength{\\textwidth}{1.0in}
    \\addtolength{\\topmargin}{-.5in}
    \\addtolength{\\textheight}{1.0in}
    \\urlstyle{same}
    \\raggedbottom
    \\raggedright
    \\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]
    \\pdfgentounicode=1
    \\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}
    \\newcommand{\\resumeSubheading}[4]{\\vspace{-2pt}\\item\\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}\\textbf{#1} & #2 \\\\\\textit{\\small#3} & \\textit{\\small #4} \\\\\\end{tabular*}\\vspace{-7pt}}
    \\newcommand{\\resumeProjectHeading}[2]{\\item\\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}\\small#1 & #2 \\\\\\end{tabular*}\\vspace{-7pt}}
    \\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
    \\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
    \\newcommand{\\resumeItemListStart}{\\begin{itemize}}
    \\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}
    \\begin{document}
    % Insert content here
    \\end{document}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      },
    });

    // console.log("Raw Gemini Resume response.text:", response.text);
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Resume API Error:", error.message);
    return null;
  }
}

generateInterviewReport.generateAtsResume = generateAtsResume;
module.exports = generateInterviewReport;