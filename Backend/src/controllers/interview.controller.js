const pdfParse = require("pdf-parse");
const generateInterviewReportFunction = require("../services/ai.service");
const interviewReportModel = require("../models/interviewreport.model");
const mongoose = require("mongoose");

/**
 * Normalize an array of items from the AI response.
 * Gemini can return data in wildly inconsistent formats:
 *   - Proper objects: {skill: "Git", severity: "medium"}
 *   - Stringified JSON: '{"skill":"Git","severity":"medium"}'
 *   - Backtick-wrapped JSON: '`{"skill":"Git"}`'
 *   - Plain strings: "Git"
 *   - Plain text: "Day 1: Review Node.js Fundamentals: ..."
 *
 * This function handles ALL of these cases and converts them
 * into proper objects that match the Mongoose schema.
 */
function normalizeArray(arr, type) {
  if (!Array.isArray(arr)) return [];

  return arr
    .map((item) => {
      // If it's already an object, use it directly
      if (typeof item === "object" && item !== null) {
        return normalizeObject(item, type);
      }

      // If it's a string, try to parse it as JSON first
      if (typeof item === "string") {
        // Try parsing as JSON (with backtick/markdown cleanup)
        let cleaned = item.trim();
        if (cleaned.startsWith("```")) {
          cleaned = cleaned
            .replace(/^```[a-z]*\n?/i, "")
            .replace(/\n?```$/i, "");
        }
        cleaned = cleaned.replace(/^`+|`+$/g, "").trim();

        try {
          const parsed = JSON.parse(cleaned);
          if (typeof parsed === "object" && parsed !== null) {
            return normalizeObject(parsed, type);
          }
        } catch (e) {
          // Not valid JSON — handle as a plain string based on type
        }

        // Plain string fallback: create an object from the string
        return createObjectFromString(item, type);
      }

      return null;
    })
    .filter((item) => item !== null);
}

/**
 * Normalize fields of an already-parsed object to match Mongoose expectations.
 */
function normalizeObject(obj, type) {
  if (type === "preparationPlan") {
    // Fix day: could be "Day 1", "1", or already a number
    if (typeof obj.day === "string") {
      const match = obj.day.match(/\d+/);
      obj.day = match ? parseInt(match[0], 10) : 1;
    }
    // Fix task: could be an array, combine into single string
    if (Array.isArray(obj.tasks)) {
      obj.task = obj.tasks.join("\n");
      delete obj.tasks;
    } else if (Array.isArray(obj.task)) {
      obj.task = obj.task.join("\n");
    }
    // Ensure task is at least an empty string
    if (!obj.task) obj.task = obj.focus || "No tasks specified";
    if (!obj.focus) obj.focus = obj.task || "General preparation";
    return { day: obj.day, focus: obj.focus, task: obj.task };
  }

  if (type === "skillGap") {
    // Ensure both fields exist
    if (!obj.skill) obj.skill = "Unspecified skill";
    if (!obj.severity || !["low", "medium", "high"].includes(obj.severity)) {
      obj.severity = "medium";
    }
    return { skill: obj.skill, severity: obj.severity };
  }

  // For technicalQuestions and behaviouralQuestions
  if (!obj.question) obj.question = "Unspecified question";
  if (!obj.intention) obj.intention = "General assessment";
  if (!obj.answer) obj.answer = "No suggested answer provided";
  return { question: obj.question, intention: obj.intention, answer: obj.answer };
}

/**
 * Create a proper object from a plain string, based on the expected type.
 * This handles cases like skillGap receiving "Git" or preparationPlan receiving
 * "Day 1: Review Node.js Fundamentals..."
 */
function createObjectFromString(str, type) {
  if (type === "skillGap") {
    return { skill: str, severity: "medium" };
  }

  if (type === "preparationPlan") {
    // Try to extract "Day X: Focus: Tasks" pattern
    const dayMatch = str.match(/^Day\s*(\d+)\s*:\s*(.*)/i);
    if (dayMatch) {
      const dayNum = parseInt(dayMatch[1], 10);
      const rest = dayMatch[2];
      // Try to split "Focus: Tasks" on the first colon
      const colonIndex = rest.indexOf(":");
      if (colonIndex > 0) {
        return {
          day: dayNum,
          focus: rest.substring(0, colonIndex).trim(),
          task: rest.substring(colonIndex + 1).trim(),
        };
      }
      return { day: dayNum, focus: rest.trim(), task: rest.trim() };
    }
    return { day: 1, focus: str, task: str };
  }

  // For questions (technical/behavioural)
  return { question: str, intention: "General assessment", answer: "No suggested answer provided" };
}

async function generateInterviewReportController(req, res) {
  try {
    let resumeText = "";

    if (req.file) {
      const pdfResult = await new pdfParse.PDFParse(
        new Uint8Array(req.file.buffer)
      ).getText();

      // Extract the actual text string from the PDF result
      if (typeof pdfResult === "string") {
        resumeText = pdfResult;
      } else if (pdfResult && typeof pdfResult.text === "string") {
        resumeText = pdfResult.text;
      } else if (pdfResult && Array.isArray(pdfResult.pages)) {
        // Fallback: combine text from all pages
        resumeText = pdfResult.pages
          .map((p) => (typeof p === "string" ? p : p.text || ""))
          .join("\n");
      } else {
        // Last resort: stringify it
        resumeText = JSON.stringify(pdfResult);
      }

      console.log("Resume text length:", resumeText.length);
      console.log("Resume text preview:", resumeText.substring(0, 200) + "...");
    }

    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReportFunction({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    if (!interviewReportByAi) {
      return res
        .status(500)
        .json({ message: "Failed to generate interview report" });
    }

    // Normalize all arrays from the AI response to match Mongoose schemas
    const normalizedData = {
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      matchScore: interviewReportByAi.matchScore || 0,
      technicalQuestions: normalizeArray(
        interviewReportByAi.technicalQuestions,
        "question"
      ),
      behaviouralQuestionsSchema: normalizeArray(
        interviewReportByAi.behaviouralQuestions,
        "question"
      ),
      skillGap: normalizeArray(interviewReportByAi.skillGaps, "skillGap"),
      preparationPlanS: normalizeArray(
        interviewReportByAi.preparationPlan,
        "preparationPlan"
      ),
    };

    console.log("Saving interview report to database...");

    const interviewReport = await interviewReportModel.create(normalizedData);

    return res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getInterviewReportController(req, res) {
  try {
    const { id } = req.params;
    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId ? { _id: id, user: req.user.id } : { uuid: id, user: req.user.id };
    const interviewReport = await interviewReportModel.findOne(query);

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }

    return res.status(200).json({
      message: "Interview report retrieved successfully",
      interviewReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllInterviewReportsController(req, res) {
  try {
    const reports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({
      message: "All interview reports retrieved successfully",
      reports,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportController,
  getAllInterviewReportsController,
};
