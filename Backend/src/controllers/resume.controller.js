const { generateAtsResume } = require("../services/ai.service");
const ResumeModel = require("../models/resume.model");
const mongoose = require("mongoose");

async function generateResumeController(req, res) {
  try {
    const {
      personalInfo,
      summary,
      skills,
      experience,
      projects,
      education,
      certifications,
      jobDescription
    } = req.body;

    if (!personalInfo || !personalInfo.name || !personalInfo.email || !personalInfo.phone || !personalInfo.location) {
      return res.status(400).json({ message: "Personal information (name, email, phone, location) is required." });
    }

    const aiResponse = await generateAtsResume({
      personalInfo,
      summary,
      skills: skills || [],
      experience: experience || [],
      projects: projects || [],
      education: education || [],
      certifications: certifications || [],
      jobDescription
    });

    if (!aiResponse) {
      return res.status(500).json({ message: "Failed to generate optimized ATS resume using AI." });
    }

    const resumeData = {
      user: req.user.id,
      atsScoreEstimate: aiResponse.atsScoreEstimate || 75,
      atsFeedback: aiResponse.atsFeedback || [],
      suggestedKeywords: aiResponse.suggestedKeywords || [],
      personalInfo: aiResponse.personalInfo || personalInfo,
      summary: aiResponse.summary || summary,
      skills: aiResponse.skills || skills || [],
      experience: aiResponse.experience || experience || [],
      projects: aiResponse.projects || projects || [],
      education: aiResponse.education || education || [],
      certifications: aiResponse.certifications || certifications || [],
      latexCode: aiResponse.latexCode
    };

    const savedResume = await ResumeModel.create(resumeData);

    return res.status(201).json({
      message: "Resume generated successfully",
      resume: savedResume
    });
  } catch (error) {
    console.error("Error generating resume:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getResumeController(req, res) {
  try {
    const { id } = req.params;
    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId ? { _id: id, user: req.user.id } : { uuid: id, user: req.user.id };
    const resume = await ResumeModel.findOne(query);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({
      message: "Resume retrieved successfully",
      resume
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllResumesController(req, res) {
  try {
    const resumes = await ResumeModel.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({
      message: "All resumes retrieved successfully",
      resumes
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  generateResumeController,
  getResumeController,
  getAllResumesController
};
